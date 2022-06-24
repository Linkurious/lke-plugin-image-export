import xhr from "axios";
import qs from "qs";
import {
  RestClient,
  Configuration,
  IOgmaConfig,
  PopulatedVisualization,
} from "@linkurious/rest-client";

const rc = new RestClient({
  baseUrl:  '../../'
});
const { key , visualizationId }  = qs.parse(location.search.slice(1)) as any as { key:string, visualizationId: string };

//@ts-ignore
if(IS_DEV){
  const API_URL = "http://localhost:3000/api/";
  xhr.defaults.baseURL = API_URL;
  // xhr.defaults.headers.get['Access-Control-Allow-Origin'] = '*';
}
export async function getConfiguration(): Promise<IOgmaConfig> {

  //@ts-ignore
  if(IS_DEV){
    return (await xhr.get<Configuration>(`/config`)).data.ogma;
  }
  const response =  await rc.config.getConfiguration();
  if(response.isSuccess()) {
    return response.body.ogma
  } else return {};
}

export async function getVisualisation() {
  //@ts-ignore
  if(IS_DEV){
    return (await xhr.get<PopulatedVisualization>(`/vis/101`)).data
  }
  const response = await rc.visualization.getVisualization({
    id: parseInt(visualizationId, 10), //parseInt(visualisationId as string, 10),
    sourceKey: key, //key as string
  });
  if (response.isSuccess()) return response.body;
  return {} as PopulatedVisualization;
}
