import { Box, Grid, Inline, Stack } from "@/components/shared/primitives";
import { Badge } from "@/components/ui/badge";

export interface ProgramSpotlightStat {
  label: string;
  value: string;
  tone?: "default" | "accent";
}

export interface ProgramSpotlightCardProps {
  eyebrow: string;
  title: string;
  description: string;
  chips: string[];
  stats: ProgramSpotlightStat[];
  className?: string;
}

export function ProgramSpotlightCard({
  eyebrow,
  title,
  description,
  chips,
  stats,
  className,
}: ProgramSpotlightCardProps) {
  return (
    <Stack
      gap={28}
      className={`rounded-xl border border-[#E9EAF0] bg-white p-8 shadow-[0_24px_70px_rgba(15,23,42,0.06)] ${className ?? ""}`}
    >
      <Stack gap={14}>
        <Badge className="w-fit border-[#38A3A5]/20 bg-[#38A3A5]/10 text-[#22577A]">
          {eyebrow}
        </Badge>

        <h2 className="max-w-2xl text-3xl font-bold leading-tight tracking-tight text-[#0F172A] lg:text-4xl">
          {title}
        </h2>

        <p className="max-w-2xl text-base leading-relaxed text-[#6B7280]">
          {description}
        </p>
      </Stack>

      <Inline gap={10} wrap justify="start">
        {chips.map((chip) => (
          <span
            key={chip}
            className="rounded-full border border-[#8C94A3]/20 bg-[#F9FAFB] px-3 py-1.5 text-xs font-semibold text-[#22577A]"
          >
            {chip}
          </span>
        ))}
      </Inline>

      <Box className="h-px bg-[#E9EAF0]" />

      <Grid className="grid-cols-2 gap-6">
        {stats.map((stat) => (
          <Stack key={stat.label} gap={4}>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
              {stat.label}
            </span>
            <span
              className={`text-2xl font-bold ${
                stat.tone === "accent" ? "text-[#38A3A5]" : "text-[#0F172A]"
              }`}
            >
              {stat.value}
            </span>
          </Stack>
        ))}
      </Grid>
    </Stack>
  );
}
