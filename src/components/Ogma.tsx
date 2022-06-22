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
import { BoundingBox, Layer, Overlay, Point } from "@linkurious/ogma";

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
  const [viewCenter, setViewCenter] = useState<{ x: number; y: number }>();
  const [layers, setLayers] = useState<Layer[]>();

  const { ogma, setBoundingBox, boundingBox, format } = useAppContext();

  useImperativeHandle(ref, () => ogma as OgmaLib, [ogma]);

  useEffect(() => {
    if (container) {
      const instance = new OgmaLib(options);
      instance.setContainer(container);

      // TODO: remove
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
      // @TODO: this is required for e2e testing. Maybe we could give it annother name, like window.ogmaImageExport ? 
      window.ogma = ogma;
      if (graph && ogma && graph !== graphData) {
        setGraphData(graph);
        ogma.initVisualization(graph);
        ogma.view.locateGraph();
        ogma.view.forceResize();

        // setLayers(
        //   new Array(4).fill(0).map((_, i) => {
        //     const div = document.createElement("div");
        //     div.classList.add("overlay");
        //     return ogma.layers.addLayer(
        //       div
        //       // position: { x: 0, y: 0 },
        //       // size: { width: 0, height: 0 }
        //     );
        //   })
        // );
      }
    }
  }, [graph, options, ogma]);

  useEffect(() => {
    const updateBbox = () => {
      if (ogma) setBoundingBox(ogma.view.getGraphBoundingBox());
    };
    const updateCenter = () => {
      if (ogma) setViewCenter(ogma.view.getCenter());
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
      ogma.events.on("move", updateCenter);
    }
    return () => {
      ogma?.events.off(updateBbox);
      ogma?.events.off(updateCenter);
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
