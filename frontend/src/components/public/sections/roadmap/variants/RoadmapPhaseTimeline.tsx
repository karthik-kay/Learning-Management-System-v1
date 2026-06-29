import { ChevronDown } from "lucide-react";

import { PublicRoadmapStepData } from "../roadmapData";

interface RoadmapPhaseTimelineProps {
  steps: PublicRoadmapStepData[];
}

export function RoadmapPhaseTimeline({ steps }: RoadmapPhaseTimelineProps) {
  return (
    <section className="bg-white py-20">
      <div className="mb-10 max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#38A3A5]">
          Timeline / Roadmap
        </p>
        <h2 className="mt-3 text-3xl font-black text-[#0F172A] md:text-4xl">
          A stepped journey from foundation to placement prep
        </h2>
        <p className="mt-3 text-sm leading-6 text-[#6B7280]">
          Each phase has a learning target, topic cluster, and estimated pace.
          Open a phase to see what gets covered.
        </p>
      </div>

      <div className="relative space-y-4 before:absolute before:left-5 before:top-4 before:h-[calc(100%-2rem)] before:w-px before:bg-[#FF7A0E]/30">
        {steps.map((step, index) => (
          <details
            key={`${step.title}-${index}`}
            className="group relative rounded-2xl border border-[#E9EAF0] bg-[#F9FAFB] p-5 pl-16 open:bg-white open:shadow-[0_18px_55px_rgba(15,23,42,0.06)]"
            open={index === 0}
          >
            <summary className="cursor-pointer list-none">
              <span className="absolute left-0 top-5 flex size-10 items-center justify-center rounded-full border-4 border-white bg-[#FF7A0E] text-sm font-black text-white shadow-sm">
                {index + 1}
              </span>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#E86C0D]">
                    Phase {index + 1}
                  </p>
                  <h3 className="mt-1 text-xl font-black text-[#0F172A]">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[#6B7280]">
                    {step.description}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-black text-[#22577A]">
                  {step.duration}
                  <ChevronDown className="size-4 transition group-open:rotate-180" />
                </div>
              </div>
            </summary>

            <div className="mt-5 border-t border-[#E9EAF0] pt-5">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#8C94A3]">
                Topics covered
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {[...step.skills, ...step.resources].slice(0, 10).map((topic) => (
                  <span
                    key={topic}
                    className="rounded-full bg-[#38A3A5]/10 px-3 py-1 text-xs font-bold text-[#22577A]"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
