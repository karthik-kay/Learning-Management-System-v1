import { ArrowUpRight, Clock3 } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { PublicRoadmapCardData } from "@/components/public/sections/roadmap/roadmapData";

interface HorizontalRoadmapCardProps {
  roadmap: PublicRoadmapCardData;
}

export function HorizontalRoadmapCard({ roadmap }: HorizontalRoadmapCardProps) {
  return (
    <article className="group self-start rounded-2xl border border-[#E9EAF0] bg-white p-4 shadow-[0_14px_40px_rgba(15,23,42,0.035)] transition hover:-translate-y-0.5 hover:border-[#FF7A0E]/35 hover:shadow-[0_22px_60px_rgba(15,23,42,0.075)]">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full bg-[#38A3A5]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.1em] text-[#22577A]">
            {roadmap.level}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F9FAFB] px-3 py-1 text-xs font-medium text-[#6B7280]">
            <Clock3 className="size-3.5" />
            {roadmap.duration}
          </span>
        </div>

        <div>
          <h3 className="text-lg font-semibold leading-snug text-[#0F172A]">
            {roadmap.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#6B7280]">
            {roadmap.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {roadmap.skills.slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="rounded-md bg-[#F9FAFB] px-2.5 py-1 text-xs font-semibold text-[#22577A]"
            >
              {skill}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-[#E9EAF0] pt-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#8C94A3]">
              Avg range
            </p>
            <p className="text-sm font-semibold text-[#E86C0D]">
              {roadmap.salaryRange}
            </p>
          </div>
          <Button
            asChild
            size="sm"
            className="bg-[#0F172A] text-white hover:bg-[#1E293B]"
          >
            <Link href={`/roadmaps/${roadmap.slug}`}>
              View path
              <ArrowUpRight className="size-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
