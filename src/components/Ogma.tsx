import React, {
  useState,
  useEffect,
  useLayoutEffect,
  forwardRef,
  useImperativeHandle,
  ReactNode,
  Ref,
} from "react";
import {
  LKOgma as OgmaLib,
  Filters,
  NodeList,
  EdgeList,
} from "@linkurious/ogma-linkurious-parser";
import { IOgmaConfig, PopulatedVisualization } from "@linkurious/rest-client";
import { useAppContext } from "../context";
import { getBoundingBox } from "../utils";
import { GraphSchema } from "../api";

const applyItemFilter = (
  ogma: OgmaLib,
  graph: PopulatedVisualization,
  isNode: boolean
) => {
  const filter = isNode ? graph.filters.node : graph.filters.edge;
  const initial = isNode ? ogma.getNodes() : ogma.getEdges();
  const items = initial.filter((item) =>
    Filters.isFiltered(filter, item.getData())
  );
  if (isNode) return ogma.removeNodes(items as NodeList);
  return ogma.removeEdges(items as EdgeList);
};

const applySchema = async (ogma: OgmaLib, graphSchema?: GraphSchema) => {
  if (graphSchema) {
    ogma.LKCaptions.graphSchema = graphSchema;
  }
};

interface OgmaProps {
  options?: Partial<IOgmaConfig>;
  onReady?: (ogma: OgmaLib) => void;
  graph?: PopulatedVisualization;
  schema?: GraphSchema;
  children?: ReactNode;
}

const defaultOptions = {};

/**
 * Main component for the Ogma library.
 */
export const OgmaComponent = (
  { options = defaultOptions, children, graph, onReady, schema }: OgmaProps,
  ref?: Ref<OgmaLib>
) => {
  const [ready, setReady] = useState(false);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [graphData, setGraphData] = useState<PopulatedVisualization>();
  const [, setViewCenter] = useState<{ x: number; y: number }>();

  const { ogma, setBoundingBox, textsVisible } = useAppContext();

  useImperativeHandle(ref, () => ogma, [ogma]);

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
      // TODO: this is required for e2e testing.
      //Maybe we could give it annother name, like window.ogmaImageExport ?
      // @ts-ignore
      window.ogma = ogma;
      if (graph && ogma && graph !== graphData) {
        setGraphData(graph);
        ogma
          .initVisualization(graph)
          // apply caption schema
          .then(() => applySchema(ogma, schema))
          // apply filters
          .then(() => applyItemFilter(ogma, graph, false))
          .then(() => applyItemFilter(ogma, graph, true))
          // set up the schema
          .then(() => ogma.view.locateGraph())
          .then(() => ogma.view.forceResize());
      }
    }
  }, [graph, options, ogma, schema]);

  useEffect(() => {
    const updateBbox = () => {
      if (ogma) setBoundingBox(getBoundingBox(ogma, textsVisible));
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
      updateBbox();
    }
    return () => {
      ogma?.events.off(updateBbox);
      ogma?.events.off(updateCenter);
    };
  }, [ogma, textsVisible]);

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
