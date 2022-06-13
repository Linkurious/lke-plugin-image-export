/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2021
 *
 * - Created on 2021-06-29.
 */

import { RawEdge, RawNode } from '@linkurious/ogma';
import { Bootstrap } from '../index';

/**
 * Generates nodes in memory
 */
async function generateNodes({ numberOfNodes = 10 } = {}) {
  const nodes: RawNode[] = [];
  for (let i = 0; i < numberOfNodes; i++) {
    nodes.push({
      id: i
    });
  }
  return nodes;
}

/**
 * Generates in memory edges linked to a random pair of nodes among 5 only nodes
 */
async function generateEdges({ nodes, numberOfEdges = 10 }) {
  const edges: RawEdge[] = [];
  for (let i = 0; i < numberOfEdges; i++) {
    // Test automation format
    edges.push({
      source: Math.floor(Math.random() * nodes.length),
      target: Math.floor(Math.random() * nodes.length)
    });
  }
  return edges;
}

async function main() {
  const nodes = generateNodes();
  const edges = generateEdges({ nodes });

  await Bootstrap.bootstrap({
    nodes,
    edges
  });
}

Promise.resolve(main());
