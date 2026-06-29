"use client";

import { useMemo, useState } from "react";

import { Grid, Stack } from "@/components/shared/primitives";

import { HierarchyDetailPanel } from "./HierarchyDetailPanel";
import { HierarchySummaryStrip } from "./HierarchySummaryStrip";
import { HierarchyTree } from "./HierarchyTree";
import { flattenHierarchy } from "./treeUtils";
import type { HierarchyNode, HierarchySummaryItem } from "./types";

interface InstitutionHierarchyProps {
  summary: HierarchySummaryItem[];
  tree: HierarchyNode[];
}

export function InstitutionHierarchy({
  summary,
  tree,
}: InstitutionHierarchyProps) {
  const flattenedHierarchy = useMemo(() => flattenHierarchy(tree), [tree]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(
    flattenedHierarchy[0]?.id ?? null,
  );
  const selectedNode =
    flattenedHierarchy.find((node) => node.id === selectedNodeId) ??
    flattenedHierarchy[0];

  return (
    <Stack gap={16}>
      <HierarchySummaryStrip items={summary} />

      <Grid className="grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px]" gap={18}>
        <HierarchyTree
          tree={tree}
          selectedNodeId={selectedNode?.id}
          onSelect={setSelectedNodeId}
        />
        <HierarchyDetailPanel node={selectedNode} />
      </Grid>
    </Stack>
  );
}

