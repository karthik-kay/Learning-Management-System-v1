import type { HierarchyNode } from "./types";

export function flattenHierarchy(nodes: HierarchyNode[]) {
  const flattened: HierarchyNode[] = [];

  function visit(node: HierarchyNode) {
    flattened.push(node);
    node.children?.forEach(visit);
  }

  nodes.forEach(visit);

  return flattened;
}

