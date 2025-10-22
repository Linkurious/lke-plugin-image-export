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

const applyNodeGrouping = async (
  ogma: OgmaLib,
  graph: PopulatedVisualization,
  groupingRule?: NodeGroupingRule
) => {
  if (groupingRule !== undefined) {
    /**
     - Set all the information regarding node grouping
     - Then set the transformation
     - Style node groups
     */
    ogma.LkNodeGroupingTransformation.setGroupingRule(groupingRule);
    ogma.LkNodeGroupingTransformation.initNodeGroupingStyle();
    if(graph.nodeGroups !== undefined) {
      ogma.LkNodeGroupingTransformation.setNodeGroupingAttributes(graph.nodeGroups);
    }
    await ogma.LkNodeGroupingTransformation.initTransformation();
    ogma.LkNodeGroupingTransformation.refreshNodeGroupingStyle();
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

/**
 * Main component for the Ogma library.
 */
export const OgmaComponent = (
  {
    options,
    children,
    graph,
    onReady,
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
      const instance = new OgmaLib(options ?? {});
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
          // apply filters
          .then(() => applyItemFilter(ogma, graph, false))
          .then(() => applyItemFilter(ogma, graph, true))
          .then(() => ogma.view.locateGraph())
          .then(() => ogma.view.forceResize())
          // set up node grouping transformation
          .then(() => applyNodeGrouping(ogma, graph, appliedNodeGroupingRules?.[0]));
      }
    }
  }, [graph, ogma]);

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
