import xhr from "axios";
import {
  Configuration,
  IOgmaConfig,
  PopulatedVisualization,
} from "@linkurious/rest-client";

const API_URL = "http://localhost:3000/api/";
xhr.defaults.baseURL = API_URL;

export async function getOgmaConfiguration(): Promise<IOgmaConfig> {
  try {
    return (await xhr.get<Configuration>(`/configuration`)).data.ogma;
  } catch (e) {
    console.error(e);
    return {};
  }
}

export async function getVis(id?: string) {
  return await (
    await xhr.get<PopulatedVisualization>(`vis/101`)
  ).data;
}
