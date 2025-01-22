import {
  RestClient,
  IOgmaConfig,
  PopulatedVisualization,
  EntityType,
  GraphSchemaTypeWithAccess,
  NodeGroupingRule,
  ISendAnalyticsParams,
  VizNode,
  VizEdge,
  Visualization
} from "@linkurious/rest-client";
import {LKOgma} from "@linkurious/ogma-linkurious-parser";

declare let IS_DEV: boolean;

const rc = new RestClient({
  // we take the first part of the url to get the base url (needed in case using baseFolder)
  baseUrl: IS_DEV ? "http://localhost:3000/" : "../../",
});

const params = new URLSearchParams(location.search);
const sourceKey = params.get("key") || params.get("sourceKey") || "key";
// 101 is bigger graph, 102 is 5 nodes
const id = params.get("id") || "101";
const source: unknown = params.get("source");

export interface GraphSchema {
  node: GraphSchemaTypeWithAccess[];
  edge: GraphSchemaTypeWithAccess[];
}

export async function getConfiguration(): Promise<{
  ogmaConfig?: IOgmaConfig;
  baseUrl?: string;
}> {
  const response = await rc.config.getConfiguration();
  if (response.isSuccess()) {
    return { ogmaConfig: response.body.ogma, baseUrl: response.body.url };
  }
  return {};
}

export async function getGraphSchema(): Promise<GraphSchema | undefined> {
  const nodeTypes = await rc.graphSchema.getTypesWithAccess({
    entityType: EntityType.NODE,
    sourceKey,
  });
  const edgeTypes = await rc.graphSchema.getTypesWithAccess({
    entityType: EntityType.EDGE,
    sourceKey,
  });
  if (nodeTypes.isSuccess() && edgeTypes.isSuccess()) {
    return {
      node: nodeTypes.body.results,
      edge: edgeTypes.body.results,
    };
  }
}

function getVisualizationFromLocalStorage(): PopulatedVisualization {
  const storeVisualizationData = localStorage.getItem('visualization');
  if (storeVisualizationData !== null) {
    localStorage.removeItem('visualization');

    // Get nodes and edges from the ogma global object of the parent window
    // to avoid a quota exceeded error when there is a lot of data (see LKE-12691)
    // and the rest of the config from the localStorage
    const parentWindowOgma = (window.parent as unknown as {ogma: LKOgma}).ogma;
    const nonFilteredNodes = parentWindowOgma.getNonFilteredNodes();
    const nonFilteredEdges = parentWindowOgma.getNonFilteredEdges();

    // getAttributes call is expensive, do the call only once for nodes and edges
    const nonFilteredNodesAttributes = nonFilteredNodes.getAttributes();
    const nonFilteredEdgesAttributes = nonFilteredEdges.getAttributes();

    const nodes = nonFilteredNodes.toJSON().map((n, index) => ({
      ...n,
      attributes: nonFilteredNodesAttributes[index]
    })) as VizNode[];

    const edges = nonFilteredEdges.toJSON().map((e, index) => ({
      ...e,
      attributes: nonFilteredEdgesAttributes[index]
    })) as VizEdge[];

    const visualization = JSON.parse(storeVisualizationData!) as Visualization;

    // We need to clone the object because attributes get mutated by the parent ogma
    return structuredClone({
      ...visualization,
      nodes,
      edges
    });
  }
  return {} as PopulatedVisualization;
}

async function getVisualizationFromBackend(
  sourceKey: string,
  id: string,
): Promise<PopulatedVisualization> {
  const response = await rc.visualization.getVisualization({
    id: parseInt(id, 10), //parseInt(visualisationId as string, 10),
    sourceKey: sourceKey, //key as string
  });
  if (response.isSuccess()) return response.body;
  return {} as PopulatedVisualization;
}

export function getVisualisation(): Promise<PopulatedVisualization> {
  // If source is local, we get the visualization from local storage
  if (source === "local") {
    return Promise.resolve(getVisualizationFromLocalStorage());
  }
  // Otherwise, we get the visualization from the backend
  return getVisualizationFromBackend(sourceKey, id);
}

export async function getNodeGroupingRules() {
  const response = await rc.nodeGrouping.getNodeGroupingRules({
    sourceKey: sourceKey, //key as string
  });
  if (response.isSuccess()) return response.body;
  return [] as NodeGroupingRule[];
}

export async function sendTelemetryEvent(
  event: string,
  properties?: Record<string, unknown>
): Promise<void> {
  const trackingEvent: ISendAnalyticsParams & { timestamp: string } = {
    type: 'track',
    timestamp: new Date().toISOString(),
    event,
    properties
  }
  await rc.linkurious.sendAnalytics(trackingEvent)
}
