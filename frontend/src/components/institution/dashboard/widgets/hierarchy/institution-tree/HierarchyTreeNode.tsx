"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

import type { HierarchyNode } from "./types";

interface HierarchyTreeNodeProps {
  node: HierarchyNode;
  selectedNodeId?: string;
  onSelect: (nodeId: string) => void;
  depth?: number;
}

export function HierarchyTreeNode({
  node,
  selectedNodeId,
  onSelect,
  depth = 0,
}: HierarchyTreeNodeProps) {
  const [isOpen, setIsOpen] = useState(depth < 2);
  const hasChildren = Boolean(node.children?.length);
  const isSelected = selectedNodeId === node.id;

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          onSelect(node.id);
          if (hasChildren) {
            setIsOpen((value) => !value);
          }
        }}
        className={cn(
          "flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm transition",
          isSelected
            ? "bg-white text-[#0F172A] shadow-sm ring-1 ring-[#38A3A5]/25"
            : "text-slate-700 hover:bg-white",
        )}
        style={{ paddingLeft: 12 + depth * 18 }}
      >
        <span
          className={cn(
            "inline-flex size-5 items-center justify-center rounded-md text-slate-400 transition",
            hasChildren ? "bg-white" : "bg-transparent",
            isOpen && "rotate-90",
          )}
        >
          {hasChildren ? <ChevronRight className="size-4" /> : null}
        </span>
        <span
          className={cn(
            "h-2 w-2 rounded-full",
            node.type === "Institution"
              ? "bg-[#0F172A]"
              : node.type === "Department"
                ? "bg-[#22577A]"
                : node.type === "Program"
                  ? "bg-[#38A3A5]"
                  : node.type === "Batch"
                    ? "bg-[#FF7A0E]"
                    : "bg-slate-400",
          )}
        />
        <span className="min-w-0 flex-1 truncate font-medium">
          {node.label}
        </span>
        <span className="shrink-0 rounded-full bg-white px-2 py-0.5 text-[11px] text-slate-500">
          {node.type}
        </span>
      </button>

      {hasChildren && isOpen ? (
        <div className="mt-1 space-y-1">
          {node.children?.map((child) => (
            <HierarchyTreeNode
              key={child.id}
              node={child}
              selectedNodeId={selectedNodeId}
              onSelect={onSelect}
              depth={depth + 1}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

