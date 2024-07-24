import {
  RestClient,
  IOgmaConfig,
  PopulatedVisualization,
  EntityType,
  GraphSchemaTypeWithAccess,
  NodeGroupingRule,
} from "@linkurious/rest-client";

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

function getVisualizationFromParentContext(): Promise<PopulatedVisualization> {
  // @ts-ignore
  console.log(window.parent.visualization as PopulatedVisualization)
  // @ts-ignore
  return Promise.resolve(window.parent.visualization as PopulatedVisualization);
}

async function getVisualizationFromBackend(
  sourceKey: string,
  id: string,
): Promise<PopulatedVisualization> {
  const response = await rc.visualization.getVisualization({
    id: parseInt(id, 10), //parseInt(visualisationId as string, 10),
    sourceKey: sourceKey, //key as string
  });
  console.log(response.body)
  if (response.isSuccess()) return response.body;
  return {} as PopulatedVisualization;
}

export async function getVisualisation(): Promise<PopulatedVisualization> {
  if (source === "parent") {
    return getVisualizationFromParentContext();
  }
  return getVisualizationFromBackend(sourceKey, id);
}

export async function getNodeGroupingRules() {
  const response = await rc.nodeGrouping.getNodeGroupingRules({
    sourceKey: sourceKey, //key as string
  });
  if (response.isSuccess()) return response.body;
  return [] as NodeGroupingRule[];
}
