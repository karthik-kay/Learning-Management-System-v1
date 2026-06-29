import { Box, Inline, Stack } from "@/components/shared/primitives";
import { Button } from "@/components/ui/button";
import { BarChart3, ExternalLink, TrendingUp } from "lucide-react";
import type { ReactNode } from "react";

interface MarketInsightCardProps {
  insight: string;
  range: string;
  className?: string;
}

export function MarketInsightCard({
  insight,
  range,
  className,
}: MarketInsightCardProps) {
  return (
    <Stack
      gap={24}
      className={`rounded-xl border border-white/10 bg-[#1E293B] p-6 text-white shadow-[0_28px_80px_rgba(15,23,42,0.18)] ${className ?? ""}`}
    >
      <p className="text-sm text-slate-300">Market Insight</p>

      <InsightRow
        icon={<BarChart3 className="size-5 text-[#38A3A5]" />}
        title="Demand Scarcity"
        text={insight}
      />
      <InsightRow
        icon={<TrendingUp className="size-5 text-[#57CC99]" />}
        title="Salary Range"
        text={`${range} for strong mid-level candidates.`}
      />

      <Box className="h-px bg-white/10" />

      <Button className="bg-white text-slate-950 hover:bg-slate-100">
        View Full Career Path
        <ExternalLink className="size-4" />
      </Button>
    </Stack>
  );
}

function InsightRow({
  icon,
  title,
  text,
}: {
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <Inline gap={14} align="start" justify="start">
      <Box className="rounded-md bg-white/5 p-2">{icon}</Box>
      <Stack gap={4}>
        <p className="text-sm font-semibold text-white">{title}</p>
        <p className="text-sm leading-relaxed text-slate-400">{text}</p>
      </Stack>
    </Inline>
  );
}
