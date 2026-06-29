import { Grid } from "@/components/shared/primitives";

import type { HierarchySummaryItem } from "./types";

interface HierarchySummaryStripProps {
  items: HierarchySummaryItem[];
}

export function HierarchySummaryStrip({ items }: HierarchySummaryStripProps) {
  return (
    <Grid className="grid-cols-2 md:grid-cols-4" gap={10}>
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
        >
          <p className="text-xs text-slate-500">{item.label}</p>
          <p className="mt-1 text-xl font-semibold text-[#0F172A]">
            {item.count}
          </p>
        </div>
      ))}
    </Grid>
  );
}

