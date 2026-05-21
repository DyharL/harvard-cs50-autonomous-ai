export interface GraphEdge {
  target: string;
  relation: string;
}

export type GraphAdjacency = Map<string, GraphEdge[]>;

export interface PathStep {
  node: string;
  relation: string | null;
}

export function findShortestPathBfs(
  graph: GraphAdjacency,
  source: string,
  target: string
): PathStep[] | null {
  if (source === target) {
    return [{ node: source, relation: null }];
  }

  const queue: Array<{ node: string; path: PathStep[] }> = [];
  const visited = new Set<string>();

  queue.push({
    node: source,
    path: [{ node: source, relation: null }]
  });
  visited.add(source);

  while (queue.length > 0) {
    const current = queue.shift()!;
    const neighbors = graph.get(current.node) || [];

    for (const edge of neighbors) {
      if (edge.target === target) {
        return [...current.path, { node: edge.target, relation: edge.relation }];
      }

      if (!visited.has(edge.target)) {
        visited.add(edge.target);
        queue.push({
          node: edge.target,
          path: [...current.path, { node: edge.target, relation: edge.relation }]
        });
      }
    }
  }

  return null;
}
