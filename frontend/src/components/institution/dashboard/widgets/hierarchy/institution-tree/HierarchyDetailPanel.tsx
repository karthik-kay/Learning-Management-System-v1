import Link from "next/link";
import { ExternalLink } from "lucide-react";

import { Inline, Stack } from "@/components/shared/primitives";

import type { HierarchyNode } from "./types";

interface HierarchyDetailPanelProps {
  node?: HierarchyNode;
}

export function HierarchyDetailPanel({ node }: HierarchyDetailPanelProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      {node ? (
        <Stack gap={18}>
          <Inline align="start">
            <Stack gap={4}>
              <span className="w-fit rounded-full bg-[#E7F6F5] px-2.5 py-1 text-xs font-medium text-[#22577A]">
                {node.type}
              </span>
              <h3 className="text-xl font-semibold tracking-tight text-[#0F172A]">
                {node.label}
              </h3>
              {node.meta ? (
                <p className="text-sm text-slate-500">{node.meta}</p>
              ) : null}
            </Stack>
            {node.href ? (
              <Link
                href={node.href}
                className="inline-flex items-center gap-1 text-sm font-semibold text-[#22577A] hover:text-[#38A3A5]"
              >
                Open
                <ExternalLink className="size-4" />
              </Link>
            ) : null}
          </Inline>

          <Stack gap={10}>
            {node.details.map((detail) => (
              <Inline
                key={detail.label}
                className="rounded-xl bg-slate-50 px-3 py-2"
              >
                <span className="text-sm text-slate-500">{detail.label}</span>
                <span className="text-sm font-semibold text-[#0F172A]">
                  {detail.value ?? "N/A"}
                </span>
              </Inline>
            ))}
          </Stack>

          <div className="rounded-2xl bg-[#FFF0E8] p-4 text-sm leading-6 text-[#8A3B00]">
            Select any node in the tree to inspect its live backend data.
            Missing relationships or fields are shown as N/A.
          </div>
        </Stack>
      ) : (
        <p className="text-sm text-slate-500">N/A</p>
      )}
    </div>
  );
}

