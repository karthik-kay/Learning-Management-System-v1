import Link from "next/link";
import { ArrowUpRight, Clock, Route } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PublicRoadmapCardData } from "@/components/public/sections/roadmap/roadmapData";

interface RoadmapCardProps {
  roadmap: PublicRoadmapCardData;
}

export function RoadmapCard({ roadmap }: RoadmapCardProps) {
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-[#E9EAF0] bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.06)] transition hover:-translate-y-1 hover:border-[#38A3A5]/50 hover:shadow-[0_30px_90px_rgba(34,87,122,0.14)]">
      <div className="flex items-center justify-between gap-3">
        <Badge className="border-transparent bg-[#FFEEE8] text-[#E86C0D]">
          {roadmap.domain}
        </Badge>
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6B7280]">
          <Clock className="size-3.5" />
          {roadmap.duration}
        </span>
      </div>

      <div className="mt-8 flex size-12 items-center justify-center rounded-2xl bg-[#0F172A] text-white shadow-[0_16px_35px_rgba(15,23,42,0.25)]">
        <Route className="size-5" />
      </div>

      <div className="mt-6 flex-1">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#38A3A5]">
          {roadmap.level}
        </p>
        <h3 className="mt-2 text-2xl font-bold leading-tight text-[#0F172A]">
          {roadmap.title}
        </h3>
        <p className="mt-3 text-sm leading-6 text-[#6B7280]">
          {roadmap.description}
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {roadmap.skills.slice(0, 4).map((skill) => (
          <span
            key={skill}
            className="rounded-full bg-[#F9FAFB] px-3 py-1 text-xs font-semibold text-[#22577A]"
          >
            {skill}
          </span>
        ))}
      </div>

      <div className="mt-7 grid grid-cols-2 gap-3 border-t border-[#E9EAF0] pt-5">
        <div>
          <p className="text-2xl font-bold text-[#0F172A]">
            {roadmap.stepsCount}
          </p>
          <p className="text-xs font-semibold text-[#8C94A3]">Stages</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-[#E86C0D]">
            {roadmap.salaryRange}
          </p>
          <p className="text-xs font-semibold text-[#8C94A3]">Avg range</p>
        </div>
      </div>

      <Button
        asChild
        className="mt-6 bg-[#0F172A] text-white hover:bg-[#1E293B]"
      >
        <Link href={`/roadmaps/${roadmap.slug}`}>
          View Roadmap
          <ArrowUpRight className="size-4" />
        </Link>
      </Button>
    </article>
  );
}
