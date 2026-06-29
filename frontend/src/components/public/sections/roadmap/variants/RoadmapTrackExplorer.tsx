"use client";

import { useMemo, useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { RoadmapTrackCard } from "@/components/public/widgets/cards/RoadmapTrackCard";
import {
  PublicRoadmapStepData,
  PublicRoadmapTrackData,
} from "../roadmapData";

interface RoadmapTrackExplorerProps {
  tracks?: PublicRoadmapTrackData[];
  fallbackSteps: PublicRoadmapStepData[];
}

export function RoadmapTrackExplorer({
  tracks,
  fallbackSteps,
}: RoadmapTrackExplorerProps) {
  const normalizedTracks = useMemo(() => {
    if (tracks?.length) return tracks;

    return [
      {
        title: "Core route",
        slug: "core-route",
        description:
          "The main sequence for this roadmap, ordered from foundations to portfolio proof.",
        focusArea: "Core learning path",
        skills: [],
        tools: [],
        steps: fallbackSteps,
      },
    ];
  }, [fallbackSteps, tracks]);

  const [activeSlug, setActiveSlug] = useState(normalizedTracks[0]?.slug ?? "");
  const activeTrack =
    normalizedTracks.find((track) => track.slug === activeSlug) ??
    normalizedTracks[0];

  if (!activeTrack) return null;

  return (
    <section className="bg-white py-20">
      <div className="mb-10 max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#38A3A5]">
          Track explorer
        </p>
        <h2 className="mt-3 text-3xl font-black text-[#0F172A] md:text-4xl">
          See the moving parts inside this roadmap
        </h2>
        <p className="mt-3 text-sm leading-6 text-[#6B7280]">
          Domains are made of smaller tracks. Pick a track to see the stages,
          skills, and project proof attached to it.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <div className="space-y-3">
          {normalizedTracks.map((track) => (
            <RoadmapTrackCard
              key={track.slug}
              track={track}
              isActive={track.slug === activeTrack.slug}
              onSelect={() => setActiveSlug(track.slug)}
            />
          ))}
        </div>

        <article className="rounded-3xl border border-[#E9EAF0] bg-[#F9FAFB] p-6 md:p-8">
          <div className="flex flex-col gap-4 border-b border-[#E9EAF0] pb-6 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#E86C0D]">
                {activeTrack.focusArea || "Learning track"}
              </p>
              <h3 className="mt-2 text-2xl font-black text-[#0F172A]">
                {activeTrack.title}
              </h3>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6B7280]">
                {activeTrack.description}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {activeTrack.tools.slice(0, 4).map((tool) => (
                <span
                  key={tool}
                  className="rounded-full bg-white px-3 py-1 text-xs font-bold text-[#22577A]"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-7 space-y-4">
            {activeTrack.steps.map((step, index) => (
              <div
                key={`${step.title}-${index}`}
                className="grid gap-4 rounded-2xl border border-[#E9EAF0] bg-white p-5 md:grid-cols-[48px_1fr]"
              >
                <div className="flex size-11 items-center justify-center rounded-2xl bg-[#0F172A] text-sm font-black text-white">
                  {index + 1}
                </div>
                <div>
                  <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h4 className="text-lg font-black text-[#0F172A]">
                        {step.title}
                      </h4>
                      <p className="mt-2 text-sm leading-6 text-[#6B7280]">
                        {step.description}
                      </p>
                    </div>
                    <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#FFEEE8] px-3 py-1 text-xs font-bold text-[#E86C0D]">
                      <ArrowRight className="size-3.5" />
                      {step.duration}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {step.skills.slice(0, 5).map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1 rounded-full bg-[#38A3A5]/10 px-3 py-1 text-xs font-bold text-[#22577A]"
                      >
                        <CheckCircle2 className="size-3" />
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
