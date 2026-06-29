import { CheckCircle2, TrendingUp } from "lucide-react";

import { PublicRoadmapDetailData } from "../roadmapData";

interface CareerOverviewSectionProps {
  roadmap: PublicRoadmapDetailData;
}

const fallbackResponsibilities = [
  "Understand the domain, tools, and workflows used by production teams.",
  "Build portfolio projects that show practical problem solving.",
  "Explain technical decisions clearly in interviews and reviews.",
  "Connect the learned skills to real roles and hiring expectations.",
];

export function CareerOverviewSection({ roadmap }: CareerOverviewSectionProps) {
  const responsibilities = roadmap.responsibilities?.length
    ? roadmap.responsibilities
    : fallbackResponsibilities;

  return (
    <section className="py-18 md:py-20">
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <article className="rounded-3xl border border-[#E9EAF0] bg-white p-7 shadow-[0_24px_80px_rgba(15,23,42,0.06)] md:p-9">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#38A3A5]">
            Career overview
          </p>
          <h2 className="mt-3 text-3xl font-black text-[#0F172A]">
            What does this path prepare you to do?
          </h2>
          <p className="mt-4 text-base leading-8 text-[#6B7280]">
            {roadmap.overview}
          </p>

          <div className="mt-7 grid gap-3">
            {responsibilities.slice(0, 4).map((item) => (
              <div key={item} className="flex gap-3 rounded-2xl bg-[#F9FAFB] p-4">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-[#38A3A5]" />
                <p className="text-sm font-semibold leading-6 text-[#0F172A]">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </article>

        <aside className="rounded-3xl border border-[#E9EAF0] bg-[#0F172A] p-6 text-white shadow-[0_24px_80px_rgba(15,23,42,0.14)]">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-[#FF7A0E]/15 text-[#FF7A0E]">
            <TrendingUp className="size-5" />
          </div>
          <h3 className="mt-5 text-2xl font-black">Market snapshot</h3>
          <div className="mt-6 space-y-3">
            <Snapshot label="Salary range" value={roadmap.salaryRange} />
            <Snapshot label="Openings signal" value="High demand" />
            <Snapshot label="Growth outlook" value="Strong" />
          </div>
        </aside>
      </div>
    </section>
  );
}

function Snapshot({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#8C94A3]">
        {label}
      </p>
      <p className="mt-1 text-xl font-black text-white">{value}</p>
    </div>
  );
}
