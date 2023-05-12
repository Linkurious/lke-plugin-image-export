import {
  RestClient,
  IOgmaConfig,
  PopulatedVisualization,
  EntityType,
} from "@linkurious/rest-client";

declare var IS_DEV: boolean;

const rc = new RestClient({
  baseUrl: IS_DEV ? "http://localhost:3000/" : "../../",
});

const params = new URLSearchParams(location.search);
const sourceKey = params.get("key") || "key";
const id = params.get("id") || "101";

export async function getConfiguration(): Promise<IOgmaConfig> {
  const response = await rc.config.getConfiguration();
  if (response.isSuccess()) return response.body.ogma;
  return {};
}

export async function getGraphSchema() {
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

export async function getVisualisation() {
  const response = await rc.visualization.getVisualization({
    id: parseInt(id, 10), //parseInt(visualisationId as string, 10),
    sourceKey: sourceKey, //key as string
  });
  if (response.isSuccess()) return response.body;
  return {} as PopulatedVisualization;
}
