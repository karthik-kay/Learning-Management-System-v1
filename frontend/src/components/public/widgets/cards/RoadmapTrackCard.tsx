import { CheckCircle2, Clock3 } from "lucide-react";

import { PublicRoadmapTrackData } from "@/components/public/sections/roadmap/roadmapData";

interface RoadmapTrackCardProps {
  track: PublicRoadmapTrackData;
  isActive: boolean;
  onSelect: () => void;
}

export function RoadmapTrackCard({
  track,
  isActive,
  onSelect,
}: RoadmapTrackCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full rounded-2xl border p-5 text-left transition ${
        isActive
          ? "border-[#38A3A5] bg-[#0F172A] text-white shadow-[0_24px_70px_rgba(15,23,42,0.18)]"
          : "border-[#E9EAF0] bg-white text-[#0F172A] hover:border-[#38A3A5]/40 hover:shadow-[0_18px_55px_rgba(15,23,42,0.06)]"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p
            className={`text-xs font-bold uppercase tracking-[0.14em] ${
              isActive ? "text-[#57CC99]" : "text-[#38A3A5]"
            }`}
          >
            {track.focusArea || "Specialized track"}
          </p>
          <h3 className="mt-2 text-lg font-black">{track.title}</h3>
        </div>
        <span
          className={`flex size-9 shrink-0 items-center justify-center rounded-full ${
            isActive ? "bg-white/10 text-[#FF7A0E]" : "bg-[#FFEEE8] text-[#E86C0D]"
          }`}
        >
          <CheckCircle2 className="size-4" />
        </span>
      </div>

      <p
        className={`mt-3 line-clamp-2 text-sm leading-6 ${
          isActive ? "text-[#E9EAF0]" : "text-[#6B7280]"
        }`}
      >
        {track.description}
      </p>

      <div
        className={`mt-5 flex items-center gap-2 text-xs font-bold ${
          isActive ? "text-[#E9EAF0]" : "text-[#6B7280]"
        }`}
      >
        <Clock3 className="size-3.5" />
        {track.steps.length} focused stages
      </div>
    </button>
  );
}
