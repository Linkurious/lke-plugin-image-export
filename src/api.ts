import xhr from "axios";
<<<<<<< HEAD
import qs from "qs";
=======
import qs from 'qs'
>>>>>>> a68207c (try to use official and mock server)
import {
  RestClient,
  Configuration,
  IOgmaConfig,
  PopulatedVisualization,
} from "@linkurious/rest-client";

const rc = new RestClient({ baseUrl: "../.." });
console.log("parsed", qs.parse(location.href));

let { key = "key", visualisationId = "101" } = qs.parse(
  location.href
) as any as { key: string; visualisationId: string };

export async function getConfiguration(): Promise<IOgmaConfig> {

  const response = await rc.config.getConfiguration();
  if (response.isSuccess()) {
    return response.body.ogma;
  } else return {};
}

export async function getVisualisation(): Promise<PopulatedVisualization> {
  const response = await rc.visualization.getVisualization({
    id: parseInt(visualisationId, 10), //parseInt(visualisationId as string, 10),
    sourceKey: key, //key as string
  });
  if (response.isSuccess()) return response.body;
  return {} as PopulatedVisualization;
}
