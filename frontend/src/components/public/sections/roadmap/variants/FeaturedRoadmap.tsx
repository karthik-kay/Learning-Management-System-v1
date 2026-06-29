import { ArrowUpRight, GitBranch, Layers3 } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { PublicRoadmapCardData } from "../roadmapData";

interface FeaturedRoadmapProps {
  roadmap: PublicRoadmapCardData;
}

export function FeaturedRoadmap({ roadmap }: FeaturedRoadmapProps) {
  return (
    <article className="overflow-hidden rounded-3xl border border-[#E9EAF0] bg-[#0F172A] text-white shadow-[0_30px_90px_rgba(15,23,42,0.18)]">
      <div className="grid gap-8 p-6 md:p-8 lg:grid-cols-[1fr_360px] lg:items-end">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#57CC99]">
            <GitBranch className="size-4" />
            Featured roadmap
          </span>
          <h3 className="mt-5 text-3xl font-black leading-tight md:text-4xl">
            {roadmap.title}
          </h3>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#E9EAF0] md:text-base">
            {roadmap.description}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {roadmap.skills.slice(0, 5).map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-bold text-[#E9EAF0]"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <aside className="rounded-2xl border border-white/10 bg-white/[0.06] p-5">
          <div className="grid grid-cols-2 gap-3">
            <MiniStat label="Domain" value={roadmap.domain} />
            <MiniStat label="Level" value={roadmap.level} />
            <MiniStat label="Duration" value={roadmap.duration} />
            <MiniStat label="Range" value={roadmap.salaryRange} />
          </div>
          <div className="mt-5 rounded-2xl bg-white/[0.06] p-4">
            <div className="flex items-center gap-2 text-[#FF7A0E]">
              <Layers3 className="size-4" />
              <p className="text-xs font-bold uppercase tracking-[0.12em]">
                Outcome
              </p>
            </div>
            <p className="mt-2 text-sm font-semibold leading-6 text-white">
              {roadmap.outcome}
            </p>
          </div>
          <Button
            asChild
            className="mt-5 w-full bg-[#FF7A0E] text-white hover:bg-[#E86C0D]"
          >
            <Link href={`/roadmaps/${roadmap.slug}`}>
              Open Roadmap
              <ArrowUpRight className="size-4" />
            </Link>
          </Button>
        </aside>
      </div>
    </article>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#1E293B]/70 p-4">
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#8C94A3]">
        {label}
      </p>
      <p className="mt-1 text-sm font-black text-white">{value}</p>
    </div>
  );
}
