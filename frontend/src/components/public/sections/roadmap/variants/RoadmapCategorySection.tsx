import {
  ArrowUpRight,
  Clock3,
  Code2,
  Flame,
} from "lucide-react";
import Link from "next/link";

import { HorizontalRoadmapCard } from "@/components/public/widgets/cards/HorizontalRoadmapCard";
import { PublicRoadmapCardData } from "../roadmapData";

interface RoadmapCategorySectionProps {
  title: string;
  description: string;
  roadmaps: PublicRoadmapCardData[];
}

export function RoadmapCategorySection({
  title,
  description,
  roadmaps,
}: RoadmapCategorySectionProps) {
  const spotlight = roadmaps[0];
  const cardRoadmaps = roadmaps.slice(0, 4);
  const skills = Array.from(
    new Set(roadmaps.flatMap((roadmap) => roadmap.skills)),
  ).slice(0, 8);
  const roles = roadmaps.map((roadmap) => roadmap.title).slice(0, 5);
  const isTrending = Boolean(spotlight?.isFeatured);

  if (!spotlight) return null;

  const headerTone = isTrending
    ? {
        panel: "bg-[#38A3A5]/10",
        icon: "bg-[#38A3A5]/15 text-[#22577A]",
        chip: "bg-[#38A3A5]/15 text-[#22577A]",
        accent: "text-[#38A3A5]",
        label: "Trending",
      }
    : {
        panel: "bg-[#FFEEE8]",
        icon: "bg-white/70 text-[#E86C0D]",
        chip: "bg-white/70 text-[#E86C0D]",
        accent: "text-[#E86C0D]",
        label: "Hot path",
      };

  return (
    <section
      id={slugify(title)}
      className="scroll-mt-24 border-t border-[#E9EAF0] bg-[#F9FAFB] py-16"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={`${headerTone.panel} px-5 py-8 md:px-8 lg:px-10`}>
          <div className="grid gap-7 lg:grid-cols-[1fr_300px] lg:items-center">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.1em] ${headerTone.chip}`}
                  >
                    <Flame className="size-3.5" />
                    {headerTone.label}
                  </span>
                  <span className="rounded-full bg-[#38A3A5]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.1em] text-[#22577A]">
                    {spotlight.level}
                  </span>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F9FAFB] px-3 py-1 text-xs font-medium text-[#6B7280]">
                  <Clock3 className="size-3.5" />
                  {spotlight.duration}
                </span>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <span
                  className={`flex size-10 items-center justify-center rounded-xl ${headerTone.icon}`}
                >
                  <Code2 className="size-5" />
                </span>
                <h2 className="text-2xl font-semibold leading-tight text-[#0F172A] md:text-3xl">
                  {title}
                </h2>
              </div>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-[#374151]">
                {description}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-md bg-white/70 px-3 py-1 text-xs font-semibold text-[#22577A]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <TechPattern
              skills={skills}
              accentClassName={headerTone.accent}
              isTrending={isTrending}
            />
          </div>
        </div>

        <div className="grid items-start gap-6 bg-[#F9FAFB] pt-6 xl:grid-cols-[1fr_360px]">
          <div className="grid items-start gap-4 md:grid-cols-2">
            {cardRoadmaps.map((roadmap) => (
              <HorizontalRoadmapCard key={roadmap.slug} roadmap={roadmap} />
            ))}
          </div>

          <aside className="border border-[#E9EAF0] bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#E86C0D]">
              Domain stats
            </p>
            <h3 className="mt-2 text-xl font-semibold text-[#0F172A]">
              Field snapshot
            </h3>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <MiniStat label="Salary" value={spotlight.salaryRange} />
              <MiniStat label="Roadmaps" value={`${roadmaps.length}`} />
              <MiniStat label="Skills covered" value={`${skills.length}+`} />
              <MiniStat label="Opportunities" value="Growing" />
            </div>
            <div className="mt-5 border border-[#E9EAF0] bg-[#F9FAFB] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8C94A3]">
                Common roles
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {roles.map((role) => (
                  <span
                    key={role}
                    className="rounded-md bg-white px-3 py-1 text-xs font-semibold text-[#22577A]"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>
            <Link
              href="/career-path"
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0F172A] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#1E293B]"
            >
              Explore career paths
              <ArrowUpRight className="size-4" />
            </Link>
          </aside>
        </div>
      </div>
    </section>
  );
}

function TechPattern({
  skills,
  accentClassName,
  isTrending,
}: {
  skills: string[];
  accentClassName: string;
  isTrending: boolean;
}) {
  const visibleSkills = skills.slice(0, 5);

  return (
    <div className="hidden min-h-[180px] border border-white/70 bg-white/45 p-5 lg:block">
      <div className="flex items-center justify-between">
        <p className={`text-xs font-semibold uppercase tracking-[0.14em] ${accentClassName}`}>
          Tech map
        </p>
        <span
          className={`size-3 rounded-full ${
            isTrending ? "bg-[#38A3A5]" : "bg-[#FF7A0E]"
          }`}
        />
      </div>

      <div className="relative mt-6 h-24">
        <div className="absolute left-0 top-1/2 h-px w-full bg-[#8C94A3]/30" />
        <div className="absolute left-1/2 top-0 h-full w-px bg-[#8C94A3]/30" />
        {visibleSkills.map((skill, index) => {
          const positions = [
            "left-0 top-0",
            "right-4 top-2",
            "left-10 bottom-0",
            "right-0 bottom-1",
            "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
          ];

          return (
            <span
              key={skill}
              className={`absolute ${positions[index]} rounded-lg bg-white px-3 py-1 text-xs font-semibold text-[#22577A] shadow-sm`}
            >
              {skill}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-[#E9EAF0] bg-[#F9FAFB] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#8C94A3]">
        {label}
      </p>
      <p className="mt-1 text-lg font-semibold text-[#0F172A]">{value}</p>
    </div>
  );
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
