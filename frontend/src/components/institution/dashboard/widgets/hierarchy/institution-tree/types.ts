export type HierarchyNodeType =
  | "Institution"
  | "Department"
  | "Program"
  | "Batch"
  | "Section";

export interface HierarchyDetail {
  label: string;
  value?: string;
}

export interface HierarchySummaryItem {
  label: string;
  count: string;
}

export interface HierarchyNode {
  id: string;
  type: HierarchyNodeType;
  label: string;
  meta?: string;
  href?: string;
  details: HierarchyDetail[];
  children?: HierarchyNode[];
}

