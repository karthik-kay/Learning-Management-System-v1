import { Grid, Stack } from "@/components/shared/primitives";
import { ReactNode } from "react";

export interface ProgramTrack {
  label: string;
  icon: ReactNode;
}

interface ProgramTrackGridProps {
  tracks: ProgramTrack[];
  className?: string;
}

export function ProgramTrackGrid({ tracks, className }: ProgramTrackGridProps) {
  return (
    <Grid className={`grid-cols-2 gap-4 sm:grid-cols-3 ${className ?? ""}`}>
      {tracks.map((track) => (
        <Stack
          key={track.label}
          gap={8}
          align="center"
          className="rounded-lg border border-[#E9EAF0] bg-white p-5 text-center shadow-[0_14px_40px_rgba(15,23,42,0.04)] transition hover:border-[#38A3A5]/40 hover:shadow-[0_18px_48px_rgba(34,87,122,0.08)]"
        >
          <span className="text-[#38A3A5]">{track.icon}</span>
          <span className="text-xs font-bold text-[#0F172A]">
            {track.label}
          </span>
        </Stack>
      ))}
    </Grid>
  );
}
