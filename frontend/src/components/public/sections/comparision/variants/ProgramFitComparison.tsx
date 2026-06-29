"use client";

import { useState } from "react";
import Link from "next/link";
import { Grid, Inline, Stack } from "@/components/shared/primitives";
import { ArrowRight, CheckCircle2, Clock3, Rocket, School } from "lucide-react";

interface FitColumn {
  title: string;
  tone: "teal" | "orange";
  items: string[];
  program?: {
    title: string;
    duration: string;
    description: string;
    href: string;
  };
}

interface ProgramFitComparisonProps {
  left: FitColumn;
  right: FitColumn;
}

const toneMap = {
  teal: {
    text: "text-teal-300",
    dot: "text-teal-300",
    border: "border-[#38A3A5]/30 bg-[#1E293B]/55",
    icon: <School className="size-4" />,
  },
  orange: {
    text: "text-orange-300",
    dot: "text-orange-300",
    border: "border-[#FF7A0E]/30 bg-[#1E293B]/55",
    icon: <Rocket className="size-4" />,
  },
};

export function ProgramFitComparison({
  left,
  right,
}: ProgramFitComparisonProps) {
  const [activeSide, setActiveSide] = useState<"left" | "right" | null>(null);

  return (
    <Stack gap={36} align="center">
      <h2 className="text-center text-3xl font-bold tracking-tight text-white">
        Not Sure Which One?
      </h2>

      <Grid className="w-full grid-cols-1 gap-8 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
        <FitColumnView
          column={left}
          isActive={activeSide === "left"}
          onActive={() => setActiveSide("left")}
        />

        <span className="mx-auto grid h-9 w-9 place-items-center rounded-full bg-[#FF7A0E] text-xs font-bold text-white shadow-[0_0_0_8px_rgba(255,122,14,0.08)]">
          OR
        </span>

        <FitColumnView
          column={right}
          isActive={activeSide === "right"}
          onActive={() => setActiveSide("right")}
        />
      </Grid>
    </Stack>
  );
}

function FitColumnView({
  column,
  isActive,
  onActive,
}: {
  column: FitColumn;
  isActive: boolean;
  onActive: () => void;
}) {
  const tone = toneMap[column.tone];

  return (
    <Stack
      gap={16}
      tabIndex={0}
      onMouseEnter={onActive}
      onFocus={onActive}
      className={`min-h-[255px] rounded-lg border ${tone.border} p-6 transition duration-300 hover:-translate-y-1 hover:bg-[#1E293B]/80 focus:outline-none focus:ring-2 focus:ring-white/20`}
    >
      <Inline gap={10} justify="start" className={tone.text}>
        {tone.icon}
        <h3 className="text-lg font-bold">You are:</h3>
      </Inline>

      <Stack gap={12}>
        {column.items.map((item) => (
          <Inline key={item} gap={10} justify="start">
            <CheckCircle2 className={`size-4 ${tone.dot}`} />
            <span className="text-sm leading-relaxed text-slate-300">
              {item}
            </span>
          </Inline>
        ))}
      </Stack>

      {column.program ? (
        <div
          className={`grid transition-all duration-300 ${
            isActive
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0 lg:grid-rows-[0fr]"
          }`}
        >
          <div className="overflow-hidden">
            <div className="mt-2 rounded-xl border border-white/10 bg-white/[0.06] p-4">
              <div className="flex items-center justify-between gap-3">
                <p className={`text-sm font-semibold ${tone.text}`}>
                  Suggested program
                </p>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-xs text-slate-300">
                  <Clock3 className="size-3.5" />
                  {column.program.duration}
                </span>
              </div>
              <h4 className="mt-3 text-lg font-semibold text-white">
                {column.program.title}
              </h4>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                {column.program.description}
              </p>
              <Link
                href={column.program.href}
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white"
              >
                View program
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </Stack>
  );
}
