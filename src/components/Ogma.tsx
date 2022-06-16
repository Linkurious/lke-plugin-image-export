import React, {
  useState,
  useEffect,
  useLayoutEffect,
  forwardRef,
  useImperativeHandle,
  ReactNode,
  Ref,
} from "react";
import { LKOgma as OgmaLib } from "@linkurious/ogma-linkurious-parser";
import { IOgmaConfig, PopulatedVisualization } from "@linkurious/rest-client";
import { useAppContext } from "../context";

interface OgmaProps {
  options?: Partial<IOgmaConfig>;
  onReady?: (ogma: OgmaLib) => void;
  graph?: PopulatedVisualization;
  children?: ReactNode;
}

const defaultOptions = {};

/**
 * Main component for the Ogma library.
 */
export const OgmaComponent = (
  { options = defaultOptions, children, graph, onReady }: OgmaProps,
  ref?: Ref<OgmaLib>
) => {
  const [ready, setReady] = useState(false);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [graphData, setGraphData] = useState<PopulatedVisualization>();

  const { ogma, setBoundingBox } = useAppContext();

  useImperativeHandle(ref, () => ogma as OgmaLib, [ogma]);

  useEffect(() => {
    if (container) {
      const instance = new OgmaLib(options);
      instance.setContainer(container);
      // @ts-ignore
      window.ogma = instance;
      setReady(true);
      if (onReady) onReady(instance);
    }
  }, [container]);

  // resize handler
  useLayoutEffect(() => {
    const updateSize = () => ogma?.view.forceResize();
    updateSize();

    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    if (ogma) {
      if (graph && ogma && graph !== graphData) {
        setGraphData(graph);
        ogma.initVisualization(graph);
        ogma.view.locateGraph();
        ogma.view.forceResize();
      }
    }
  }, [graph, options, ogma]);

  useEffect(() => {
    const updateBbox = () => {
      if (ogma) setBoundingBox(ogma.view.getGraphBoundingBox());
    };
    if (ogma) {
      ogma.setOptions({
        interactions: {
          selection: { enabled: false },
        },
      });

      // items should not be highlighted
      ogma.styles.setHoveredNodeAttributes(null);
      ogma.styles.setHoveredEdgeAttributes(null);

      ogma.events.on(
        ["addNodes", "addEdges", "layoutEnd", "nodesDragEnd"],
        updateBbox
      );
    }
    return () => {
      ogma?.events.off(updateBbox);
    };
  }, [ogma]);

  return (
    <div
      className="visualisation--container"
      ref={(containerRef) => setContainer(containerRef)}
    >
      {ready && children}
    </div>
  );
};

export const Ogma = forwardRef(OgmaComponent);
