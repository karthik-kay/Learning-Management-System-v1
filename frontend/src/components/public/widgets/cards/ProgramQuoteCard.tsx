import { Box, Inline, Stack } from "@/components/shared/primitives";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ProgramQuoteCardProps {
  duration: string;
  quote: string;
  description: string;
  cohortDate: string;
  reserveHref: string;
  pricingHref: string;
  className?: string;
}

export function ProgramQuoteCard({
  duration,
  quote,
  description,
  cohortDate,
  reserveHref,
  pricingHref,
  className,
}: ProgramQuoteCardProps) {
  return (
    <Stack
      gap={22}
      className={`rounded-xl border border-[#E9EAF0] bg-white p-7 shadow-[0_24px_70px_rgba(15,23,42,0.07)] ${className ?? ""}`}
    >
      <Inline>
        <span className="rounded-full bg-[#FFEEE8] px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#E86C0D]">
          {duration}
        </span>
        <Link
          href={pricingHref}
          className="text-xs font-bold text-[#E86C0D] hover:text-[#FF7A0E]"
        >
          View Pricing
        </Link>
      </Inline>

      <Stack gap={8}>
        <p className="text-lg font-bold italic leading-relaxed text-[#0F172A]">
          &quot;{quote}&quot;
        </p>
        <p className="text-sm leading-relaxed text-slate-500">{description}</p>
      </Stack>

      <Box className="rounded-lg border border-white/10 bg-[#1E293B] p-5 text-white">
        <Inline gap={14} justify="start">
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
        </Inline>
      </Box>

      <Button
        asChild
        variant="outline"
        className="border-[#FF7A0E] text-[#E86C0D] hover:bg-[#FFEEE8]"
      >
        <Link href={reserveHref}>Reserve My Spot</Link>
      </Button>
    </Stack>
  );
}
