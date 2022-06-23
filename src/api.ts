import xhr from "axios";
import qs from 'qs'
import {
  RestClient,
  Configuration,
  IOgmaConfig,
  PopulatedVisualization,
} from "@linkurious/rest-client";

const rc = new RestClient({ baseUrl: "http://localhost:3000/" });

let {key = 'key', visualisationId = '101'}  = qs.parse(location.href) as any as { key:string, visualisationId: string };

export async function getConfiguration(): Promise<IOgmaConfig> {
  const response = await rc.config.getConfiguration();
  if(response.isSuccess()) {
    return response.body.ogma
  } else return {};
}

export async function getVisualisation() {
  const response = await rc.visualization.getVisualization({
    id: 101, //parseInt(visualisationId as string, 10),
    sourceKey: 'key', //key as string 
  });
  if(response.isSuccess()){
    return response.body;
  }
  return {};
}