import {
  GraphSchemaTypeWithAccess,
  PopulatedVisualization,
  Visualization,
  VizEdge,
  VizNode
} from "@linkurious/rest-client";
import {LKOgma} from "@linkurious/ogma-linkurious-parser";

declare global {
  interface Window {
    __visualizationToExport?: Visualization, // The exact type is VisualizationObjectState from frontend
    ogma: LKOgma
  }
}

export interface GraphSchema {
  node: GraphSchemaTypeWithAccess[];
  edge: GraphSchemaTypeWithAccess[];
}

function getVisualizationFromParentWindow(): PopulatedVisualization {
  const visualization = window.parent.__visualizationToExport;
  if (visualization != null) {
    delete window.parent.__visualizationToExport;

    // Get nodes and edges from the ogma global object of the parent window
    // to avoid a quota exceeded error when there is a lot of data (see LKE-12691)
    // and the rest of the config from the localStorage
    const parentWindowOgma = window.parent.ogma;
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


    // We need to clone the object because attributes get mutated by the parent ogma
    return structuredClone({
      ...visualization,
      nodes,
      edges
    });
  }
  return {} as PopulatedVisualization;
}

export function getVisualisation(): Promise<PopulatedVisualization> {
  // If source is local, we get the visualization from the parent window
  return Promise.resolve(getVisualizationFromParentWindow());
  // Otherwise, we get the visualization from the backend
}
