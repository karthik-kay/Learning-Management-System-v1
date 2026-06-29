import { Stack } from "@/components/shared/primitives";

import { HierarchyTreeNode } from "./HierarchyTreeNode";
import type { HierarchyNode } from "./types";

interface HierarchyTreeProps {
  tree: HierarchyNode[];
  selectedNodeId?: string;
  onSelect: (nodeId: string) => void;
}

export function HierarchyTree({
  tree,
  selectedNodeId,
  onSelect,
}: HierarchyTreeProps) {
  return (
    <div className="min-h-[420px] rounded-2xl border border-slate-200 bg-slate-50 p-4">
      {tree.length ? (
        <Stack gap={4}>
          {tree.map((node) => (
            <HierarchyTreeNode
              key={node.id}
              node={node}
              selectedNodeId={selectedNodeId}
              onSelect={onSelect}
            />
          ))}
        </Stack>
      ) : (
        <div className="rounded-xl bg-white p-4 text-sm text-slate-500">
          N/A
        </div>
      )}
    </div>
  );
}

