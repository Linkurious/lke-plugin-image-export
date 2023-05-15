import React, {
  useState,
  useEffect,
  useLayoutEffect,
  forwardRef,
  useImperativeHandle,
  ReactNode,
  Ref,
  useCallback,
} from "react";
import {
  LKOgma as OgmaLib,
  Filters,
  NodeList,
  EdgeList,
} from "@linkurious/ogma-linkurious-parser";
import { IOgmaConfig, PopulatedVisualization } from "@linkurious/rest-client";
import { useAnnotationsContext, useAppContext } from "../context";
import { getBoundingBox, mergeBounds } from "../utils";
import { GraphSchema } from "../api";
import { getAnnotationsBounds } from "@linkurious/annotations-control";

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

  const { ogma, setBoundingBox, boundingBox, textsVisible } = useAppContext();
  const { annotations } = useAnnotationsContext();

  useImperativeHandle(ref, () => ogma, [ogma]);

  useEffect(() => {
    if (container) {
      const instance = new OgmaLib(options);
      instance.setContainer(container);

      instance.setOptions({
        interactions: {
          selection: { enabled: false },
        },
      });

      // items should not be highlighted
      instance.styles.setHoveredNodeAttributes(null);
      instance.styles.setHoveredEdgeAttributes(null);

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
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
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

  const updateBbox = useCallback(() => {
    if (ogma) {
      let bounds = getBoundingBox(ogma, textsVisible);
      if (annotations.features.length > 0)
        bounds = mergeBounds(bounds, getAnnotationsBounds(annotations));
      // console.log("updateBbox", bounds);
      setBoundingBox(bounds);
    }
  }, [ogma, textsVisible, annotations]);

  useEffect(() => {
    const updateCenter = () => {
      if (ogma) setViewCenter(ogma.view.getCenter());
    };
    if (ogma) {
      ogma.events
        .on(["addNodes", "addEdges", "layoutEnd", "nodesDragEnd"], updateBbox)
        .on("move", updateCenter);
      updateBbox();
    }
    return () => {
      ogma?.events.off(updateBbox).off(updateCenter);
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
