import { Search, Sparkles } from "lucide-react";

import { Container } from "@/components/shared/primitives";

interface RoadmapsHeroProps {
  totalRoadmaps: number;
  placedLearners?: string;
  search: string;
  onSearchChange: (value: string) => void;
}

export function RoadmapsHero({
  totalRoadmaps,
  placedLearners = "2,500+",
  search,
  onSearchChange,
}: RoadmapsHeroProps) {
  return (
    <section className="bg-[#0F172A] py-16 text-white md:py-20">
      <Container>
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#57CC99]">
            <Sparkles className="size-4" />
            Career Roadmaps
          </span>
          <h1 className="mt-6 text-4xl font-black leading-tight md:text-6xl">
            Build the skills behind the role.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#E9EAF0] md:text-lg">
            Explore domain roadmaps, compare focused tracks, and choose the
            path that turns learning into portfolio proof.
          </p>

          <label className="relative mx-auto mt-8 block max-w-2xl">
            <Search className="absolute left-5 top-1/2 size-5 -translate-y-1/2 text-[#8C94A3]" />
            <input
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search web dev, AI, DevOps, data..."
              className="h-14 w-full rounded-2xl border border-white/10 bg-white px-12 text-sm font-bold text-[#0F172A] outline-none shadow-[0_24px_70px_rgba(0,0,0,0.16)] placeholder:text-[#8C94A3] focus:border-[#FF7A0E]"
            />
          </label>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <StatChip value={`${totalRoadmaps}+`} label="roadmaps" />
            <StatChip value={placedLearners} label="learners placed" />
          </div>
        </div>
      </Container>
    </section>
  );
}

function StatChip({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2">
      <span className="font-black text-[#FF7A0E]">{value}</span>
      <span className="ml-2 text-sm font-semibold text-[#E9EAF0]">{label}</span>
    </div>
  );
}
