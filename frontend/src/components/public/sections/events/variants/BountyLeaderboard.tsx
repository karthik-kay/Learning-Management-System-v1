import { Grid, Inline, Stack } from "@/components/shared/primitives";
import { Button } from "@/components/ui/button";
import { ArrowRight, Trophy } from "lucide-react";
import Link from "next/link";

interface LeaderboardEntry {
  rank: number;
  name: string;
  score: string;
  prize: string;
}

interface BountyLeaderboardProps {
  entries: LeaderboardEntry[];
  href: string;
}

export function BountyLeaderboard({ entries, href }: BountyLeaderboardProps) {
  return (
    <Stack
      gap={24}
      className="rounded-2xl border border-white/10 bg-[#1E293B] p-6 text-white shadow-[0_28px_80px_rgba(15,23,42,0.18)]"
    >
      <Inline>
        <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[#FEBC38]">
          <Trophy className="size-5" />
          Current Bounty Leaderboard
        </span>
        <Button asChild size="sm" variant="secondary" className="bg-white/10 text-white hover:bg-white/15">
          <Link href={href}>
            View Full
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </Inline>

      <Grid className="grid-cols-1 gap-3 md:grid-cols-3">
        {entries.map((entry) => (
          <div
            key={entry.rank}
            className="rounded-xl border border-white/10 bg-white/[0.04] p-4"
          >
            <p className="text-xs font-bold uppercase tracking-widest text-[#8C94A3]">
              Rank {entry.rank}
            </p>
            <p className="mt-2 text-lg font-bold">{entry.name}</p>
            <Inline className="mt-4">
              <span className="text-sm text-[#E9EAF0]">{entry.score}</span>
              <span className="text-sm font-bold text-[#57CC99]">
                {entry.prize}
              </span>
            </Inline>
          </div>
        ))}
      </Grid>
    </Stack>
  );
}
