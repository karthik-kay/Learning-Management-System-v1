import { BadgeCheck, LineChart, Wrench } from "lucide-react";

import { RoadmapStatPill } from "@/components/public/widgets/display/RoadmapStatPill";
import { PublicRoadmapDetailData } from "../roadmapData";

interface RoadmapOverviewProps {
  roadmap: PublicRoadmapDetailData;
}

export function RoadmapOverview({ roadmap }: RoadmapOverviewProps) {
  return (
    <section className="py-18 md:py-20">
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <article className="rounded-3xl border border-[#E9EAF0] bg-white p-7 shadow-[0_24px_80px_rgba(15,23,42,0.06)] md:p-9">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#38A3A5]">
            Roadmap overview
          </p>
          <h2 className="mt-3 text-3xl font-black text-[#0F172A]">
            What this path helps you master
          </h2>
          <p className="mt-4 text-base leading-8 text-[#6B7280]">
            {roadmap.overview}
          </p>

          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            <RoadmapStatPill label="Duration" value={roadmap.duration} />
            <RoadmapStatPill
              label="Tracks"
              value={roadmap.tracks?.length || roadmap.stepsCount}
              tone="orange"
            />
            <RoadmapStatPill label="Level" value={roadmap.level} tone="dark" />
          </div>

          <div className="mt-7 rounded-2xl bg-[#FFEEE8] p-5">
            <p className="flex items-center gap-2 text-sm font-bold text-[#E86C0D]">
              <LineChart className="size-4" />
              Outcome
            </p>
            <p className="mt-2 text-lg font-black text-[#0F172A]">
              {roadmap.outcome}
            </p>
          </div>
        </article>

        <aside className="space-y-4">
          <InfoPanel icon={<Wrench />} title="Tools" items={roadmap.tools} />
          <InfoPanel
            icon={<BadgeCheck />}
            title="Core skills"
            items={roadmap.skills}
          />
        </aside>
      </div>
    </section>
  );
}

function InfoPanel({
  icon,
  title,
  items,
}: {
  icon: React.ReactNode;
  title: string;
  items: string[];
}) {
  return (
    <div className="rounded-3xl border border-[#E9EAF0] bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,0.05)]">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-2xl bg-[#FFEEE8] text-[#E86C0D] [&_svg]:size-5">
          {icon}
        </div>
        <h2 className="text-lg font-black text-[#0F172A]">{title}</h2>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="rounded-full bg-[#F9FAFB] px-3 py-1 text-xs font-bold text-[#22577A]"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
