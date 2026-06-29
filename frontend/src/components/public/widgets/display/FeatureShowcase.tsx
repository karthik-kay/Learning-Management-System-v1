import type { ReactNode } from "react";
import Link from "next/link";

import { Box, Grid, Inline, Stack } from "@/components/shared/primitives";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FeatureShowcaseProps {
  eyebrow?: string;
  title: string;
  description: string;
  bullets?: string[];
  ctaLabel?: string;
  href?: string;
  mockup?: ReactNode;
  className?: string;
}

export function FeatureShowcase({
  eyebrow,
  title,
  description,
  bullets,
  ctaLabel,
  href,
  mockup,
  className,
}: FeatureShowcaseProps) {
  return (
    <Grid
      className={cn("grid-cols-1 items-center lg:grid-cols-[1.05fr_1fr]", className)}
      gap={32}
    >
      <Box className="relative min-h-[320px] overflow-hidden rounded-2xl bg-[#111111] p-6 text-white shadow-xl">
        {mockup ?? (
          <Stack gap={20} className="h-full">
            <Stack gap={8}>
              <p className="text-2xl font-bold leading-tight">{title}</p>
              <p className="max-w-sm text-sm leading-relaxed text-[#9CA3AF]">
                {description}
              </p>
            </Stack>

            <Box className="mt-auto overflow-hidden rounded-xl border border-white/10 bg-[#171717] shadow-2xl">
              <Inline
                justify="start"
                gap={8}
                className="border-b border-white/10 px-4 py-3"
              >
                <span className="h-2.5 w-2.5 rounded-full bg-[#EF4444]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#F59E0B]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#22C55E]" />
              </Inline>
              <Stack gap={10} className="p-4">
                <span className="h-2 w-8/12 rounded-full bg-white/20" />
                <span className="h-2 w-10/12 rounded-full bg-[#FF7A0E]/70" />
                <span className="h-2 w-7/12 rounded-full bg-white/15" />
                <span className="h-2 w-9/12 rounded-full bg-white/15" />
              </Stack>
            </Box>
          </Stack>
        )}
      </Box>

      <Stack gap={20} className="py-2">
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#FF7A0E]">
            {eyebrow}
          </p>
        )}

        <Stack gap={12}>
          <h3 className="max-w-xl text-3xl font-black leading-tight text-[#0F172A] md:text-4xl">
            {title}
          </h3>
          <p className="max-w-xl text-base leading-relaxed text-[#475569]">
            {description}
          </p>
        </Stack>

        {bullets && bullets.length > 0 && (
          <Stack gap={12}>
            {bullets.map((bullet) => (
              <Inline key={bullet} justify="start" align="start" gap={10}>
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#FF7A0E]" />
                <span className="text-sm leading-relaxed text-[#334155]">
                  {bullet}
                </span>
              </Inline>
            ))}
          </Stack>
        )}

        {ctaLabel && href && (
          <Inline justify="start">
            <Button asChild className="bg-[#111111] text-white hover:bg-[#FF7A0E]">
              <Link href={href}>{ctaLabel}</Link>
            </Button>
          </Inline>
        )}
      </Stack>
    </Grid>
  );
}
