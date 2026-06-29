import { CheckCircle2 } from "lucide-react";

import { PublicRoadmapStepData } from "@/components/public/sections/roadmap/roadmapData";

interface RoadmapNodeProps {
  step: PublicRoadmapStepData;
  index: number;
}

export function RoadmapNode({ step, index }: RoadmapNodeProps) {
  return (
    <article className="relative rounded-2xl border border-[#E9EAF0] bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,0.05)]">
      <div className="flex flex-col gap-5 md:flex-row md:items-start">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#FFEEE8] text-lg font-black text-[#E86C0D]">
          {String(index + 1).padStart(2, "0")}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="text-xl font-bold text-[#0F172A]">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#6B7280]">
                {step.description}
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-[#F9FAFB] px-3 py-1 text-xs font-bold text-[#22577A]">
              {step.duration}
            </span>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {step.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-[#E9EAF0] bg-white px-3 py-1 text-xs font-semibold text-[#22577A]"
              >
                {skill}
              </span>
            ))}
          </div>

          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            {step.resources.map((resource) => (
              <div
                key={resource}
                className="flex items-center gap-2 rounded-xl bg-[#F9FAFB] px-3 py-2 text-sm font-medium text-[#0F172A]"
              >
                <CheckCircle2 className="size-4 text-[#38A3A5]" />
                {resource}
              </div>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
