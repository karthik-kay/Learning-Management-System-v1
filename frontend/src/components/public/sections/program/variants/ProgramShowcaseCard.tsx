"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  ChevronDown,
  Clock3,
  Sparkles,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export interface ProgramShowcaseTrack {
  label: string;
  description: string;
  roles: string[];
  skills: string[];
}

export interface ProgramShowcaseStat {
  label: string;
  value: string;
  tone?: "default" | "accent";
}

export interface ProgramShowcasePhase {
  title: string;
  subtitle: string;
}

interface ProgramShowcaseCardProps {
  eyebrow: string;
  title: string;
  description: string;
  chips: string[];
  stats: ProgramShowcaseStat[];
  duration: string;
  priceLabel: string;
  bullets: string[];
  cohortDate: string;
  phases: ProgramShowcasePhase[];
  tracks: ProgramShowcaseTrack[];
  detailsHref: string;
  reserveHref: string;
  tone?: "teal" | "orange";
}

export function ProgramShowcaseCard({
  eyebrow,
  title,
  description,
  chips,
  stats,
  duration,
  priceLabel,
  bullets,
  cohortDate,
  phases,
  tracks,
  detailsHref,
  reserveHref,
  tone = "teal",
}: ProgramShowcaseCardProps) {
  const [activeTrackLabel, setActiveTrackLabel] = useState(tracks[0]?.label ?? "");
  const activeTrack = tracks.find((track) => track.label === activeTrackLabel) ?? tracks[0];
  const accent = tone === "teal" ? "#38A3A5" : "#FF7A0E";
  const accentLight = tone === "teal" ? "bg-[#38A3A5]/10" : "bg-[#FFEEE8]";
  const accentText = tone === "teal" ? "text-[#22577A]" : "text-[#E86C0D]";

  return (
    <article className="overflow-hidden rounded-3xl border border-[#E9EAF0] bg-white shadow-[0_24px_80px_rgba(15,23,42,0.06)]">
      <div className="grid gap-0 lg:grid-cols-[1fr_380px]">
        <div className="p-6 md:p-8 lg:p-10">
          <span
            className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${accentLight} ${accentText}`}
          >
            {eyebrow}
          </span>

          <h2 className="mt-5 max-w-2xl text-3xl font-semibold leading-tight text-[#0F172A] lg:text-4xl">
            {title}
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-7 text-[#6B7280]">
            {description}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {chips.map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-[#E9EAF0] bg-[#F9FAFB] px-3 py-1.5 text-xs font-medium text-[#22577A]"
              >
                {chip}
              </span>
            ))}
          </div>

          <div className="mt-7 border-t border-[#E9EAF0] pt-6">
            <ProgramPhaseTimeline phases={phases} tone={tone} />

            <div className="mt-7 border-t border-[#E9EAF0] pt-6">
              <label className="text-sm font-medium text-[#0F172A]">
                Track sneak peek
              </label>
              <div className="relative mt-3 max-w-xl">
                <select
                  value={activeTrackLabel}
                  onChange={(event) => setActiveTrackLabel(event.target.value)}
                  className="h-12 w-full appearance-none rounded-2xl border border-[#E9EAF0] bg-[#F9FAFB] px-4 pr-10 text-sm font-medium text-[#0F172A] outline-none focus:border-[#38A3A5]"
                >
                  {tracks.map((track) => (
                    <option key={track.label} value={track.label}>
                      {track.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-[#6B7280]" />
              </div>

              {activeTrack ? (
                <div className={`mt-4 rounded-2xl p-5 ${accentLight}`}>
                  <p className="text-sm leading-6 text-[#374151]">
                    {activeTrack.description}
                  </p>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-xs font-medium text-[#6B7280]">
                        Roles this track points to
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {activeTrack.roles.map((role) => (
                          <span
                            key={role}
                            className="rounded-md bg-white px-3 py-1 text-xs font-medium text-[#22577A]"
                          >
                            {role}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-[#6B7280]">
                        What you will touch
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {activeTrack.skills.map((skill) => (
                          <span
                            key={skill}
                            className="rounded-md bg-white px-3 py-1 text-xs font-medium text-[#0F172A]"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="mt-6 grid grid-cols-2 gap-5">
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <p className="text-xs font-medium text-[#8C94A3]">
                      {stat.label}
                    </p>
                    <p
                      className="mt-1 text-2xl font-semibold"
                      style={{
                        color: stat.tone === "accent" ? accent : "#0F172A",
                      }}
                    >
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <aside className="border-t border-[#E9EAF0] bg-[#0F172A] p-6 text-white md:p-8 lg:border-l lg:border-t-0">
          <div className="flex items-center justify-between gap-4">
            <span
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${accentLight} ${accentText}`}
            >
              <Clock3 className="size-3.5" />
              {duration}
            </span>
            <div className="text-right">
              <p className="text-xs font-medium text-[#8C94A3]">Starting at</p>
              <p className="text-xl font-semibold">{priceLabel}</p>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            {bullets.map((bullet) => (
              <div key={bullet} className="flex gap-3">
                <BadgeCheck
                  className="mt-0.5 size-4 shrink-0"
                  style={{ color: accent }}
                />
                <p className="text-sm leading-6 text-[#E9EAF0]">{bullet}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 border-t border-white/10 pt-6">
            <div className="grid grid-cols-[44px_1fr] gap-4">
              <span className="grid size-11 place-items-center rounded-full bg-[#FF7A0E] text-sm font-semibold">
                10
              </span>
              <div>
                <p className="text-xs font-medium text-[#8C94A3]">
                  Next cohort starts
                </p>
                <p className="mt-1 text-sm font-semibold">{cohortDate}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-3">
            <Button asChild className="bg-[#38A3A5] text-white hover:bg-[#22577A]">
              <Link href={detailsHref}>
                View program details
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
            >
              <Link href={reserveHref}>Reserve spot</Link>
            </Button>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3">
            <Mini icon={<Sparkles />} label="Projects" value="4+" />
            <Mini icon={<Users />} label="Mentors" value="1:1" />
            <Mini icon={<CalendarDays />} label="Reviews" value="Weekly" />
          </div>
        </aside>
      </div>
    </article>
  );
}

function ProgramPhaseTimeline({
  phases,
  tone,
}: {
  phases: ProgramShowcasePhase[];
  tone: "teal" | "orange";
}) {
  const accentClass = tone === "teal" ? "bg-[#38A3A5]" : "bg-[#FF7A0E]";
  const textClass = tone === "teal" ? "text-[#22577A]" : "text-[#E86C0D]";

  return (
    <div>
      <p className="text-sm font-medium text-[#0F172A]">Phase timeline</p>
      <div className="mt-3 overflow-x-auto pb-1">
        <div className="relative flex min-w-max gap-5 pr-2">
          <div className="absolute left-2 right-2 top-2 h-px bg-[#E9EAF0]" />
          {phases.map((phase, index) => (
            <div key={`${phase.title}-${index}`} className="relative w-28">
              <span
                className={`relative z-10 block size-4 rounded-full ring-4 ring-white ${accentClass}`}
              >
                <span className="sr-only">Phase {index + 1}</span>
              </span>
              <p className={`mt-3 text-xs font-semibold ${textClass}`}>
                {phase.title}
              </p>
              <p className="mt-1 line-clamp-2 text-xs leading-4 text-[#6B7280]">
                {phase.subtitle}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Mini({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-white/5 p-3">
      <div className="text-[#FF7A0E] [&_svg]:size-4">{icon}</div>
      <p className="mt-2 text-xs text-[#8C94A3]">{label}</p>
      <p className="text-sm font-semibold text-white">{value}</p>
    </div>
  );
}
