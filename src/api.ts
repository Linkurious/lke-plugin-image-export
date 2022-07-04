import qs from "qs";
import {
  RestClient,
  IOgmaConfig,
  PopulatedVisualization,
} from "@linkurious/rest-client";

declare var IS_DEV: boolean;

const rc = new RestClient({
  baseUrl: IS_DEV ? "http://localhost:3000/" : "../../",
});

const { key = "key", visualizationId = "101" } = qs.parse(
  location.search.slice(1)
) as {
  key: string;
  visualizationId: string;
};

export async function getConfiguration(): Promise<IOgmaConfig> {
  const response = await rc.config.getConfiguration();
  if (response.isSuccess()) return response.body.ogma;
  return {};
}

export async function getVisualisation() {
  const response = await rc.visualization.getVisualization({
    id: parseInt(visualizationId, 10), //parseInt(visualisationId as string, 10),
    sourceKey: key, //key as string
  });
  if (response.isSuccess()) return response.body;
  return {} as PopulatedVisualization;
}
