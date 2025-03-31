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
import {
  IOgmaConfig,
  PopulatedVisualization,
  NodeGroupingRule,
} from "@linkurious/rest-client";
import { useAppContext } from "../context";
import { getBoundingBox } from "../utils";
import { GraphSchema } from "../api";
import rtl from "@mapbox/mapbox-gl-rtl-text";

OgmaLib.libraries["@mapbox/mapbox-gl-rtl-text"] = rtl;

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

const applyNodeGrouping = async (
  ogma: OgmaLib,
  groupingRule?: NodeGroupingRule
) => {
  if (groupingRule !== undefined) {
    ogma.LkNodeGroupingTransformation.initNodeGroupingStyle();
    await ogma.LkNodeGroupingTransformation.initTransformation();
    ogma.LkNodeGroupingTransformation.setGroupingRule(groupingRule);
    await ogma.LkNodeGroupingTransformation.refreshTransformation();
  }
};

interface OgmaProps {
  options?: Partial<IOgmaConfig>;
  onReady?: (ogma: OgmaLib) => void;
  graph?: PopulatedVisualization;
  schema?: GraphSchema;
  children?: ReactNode;
  baseUrl?: string;
  appliedNodeGroupingRules?: NodeGroupingRule[];
}

const defaultOptions = {};

/**
 * Main component for the Ogma library.
 */
export const OgmaComponent = (
  {
    options = defaultOptions,
    children,
    graph,
    onReady,
    schema,
    baseUrl,
    appliedNodeGroupingRules,
  }: OgmaProps,
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
      const instance = new OgmaLib(options, baseUrl);
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
          .then(() => ogma.view.forceResize())
          // set up node grouping transformation
          .then(() => applyNodeGrouping(ogma, appliedNodeGroupingRules?.[0]));
      }
    }
  }, [graph, options, ogma, schema]);

  const updateBbox = useCallback(() => {
    if (ogma) {
      setBoundingBox(getBoundingBox(ogma, textsVisible));
    }
  }, [ogma, textsVisible]);

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
