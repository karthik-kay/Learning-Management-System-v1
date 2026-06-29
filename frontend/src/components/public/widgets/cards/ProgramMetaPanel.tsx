import { Box, Grid, Inline, Stack } from "@/components/shared/primitives";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface ProgramMetaPanelProps {
  duration: string;
  priceLabel: string;
  bullets: string[];
  cohortDate: string;
  reserveHref: string;
  detailsHref: string;
  className?: string;
}

export function ProgramMetaPanel({
  duration,
  priceLabel,
  bullets,
  cohortDate,
  reserveHref,
  detailsHref,
  className,
}: ProgramMetaPanelProps) {
  return (
    <Stack
      gap={28}
      className={`rounded-xl border border-white/10 bg-[#1E293B] p-7 text-white shadow-[0_28px_80px_rgba(15,23,42,0.22)] ${className ?? ""}`}
    >
      <Inline>
        <span className="rounded-full bg-[#38A3A5]/15 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#57CC99]">
          {duration}
        </span>
        <Stack gap={3} align="end">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Starting at
          </span>
          <span className="text-xl font-bold">{priceLabel}</span>
        </Stack>
      </Inline>

      <Stack gap={12}>
        {bullets.map((bullet) => (
          <Inline key={bullet} gap={10} justify="start">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FF7A0E]" />
            <span className="text-sm leading-relaxed text-slate-300">
              {bullet}
            </span>
          </Inline>
        ))}
      </Stack>

      <Box className="h-px bg-white/10" />

      <Grid className="grid-cols-[48px_1fr_auto] gap-4 items-center">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-[#FF7A0E] text-sm font-bold">
          10
        </span>
        <Stack gap={2}>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Next cohort starts
          </span>
          <span className="text-sm font-bold uppercase tracking-wide">
            {cohortDate}
          </span>
        </Stack>
        <Button
          asChild
          size="sm"
          variant="outline"
          className="border-[#FF7A0E]/70 bg-transparent text-[#FF7A0E] hover:bg-[#FF7A0E]/10 hover:text-[#FF7A0E]"
        >
          <Link href={reserveHref}>Reserve Spot</Link>
        </Button>
      </Grid>

      <Button asChild className="bg-[#38A3A5] text-white hover:bg-[#22577A]">
        <Link href={detailsHref}>
          View Program Details
          <ArrowRight className="size-4" />
        </Link>
      </Button>
    </Stack>
  );
}
