import { ArrowLeft, ArrowRight, BadgeCheck, Clock, LineChart, Users } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/shared/primitives";
import { Button } from "@/components/ui/button";
import { PublicRoadmapDetailData } from "../roadmapData";

interface RoadmapDetailHeroProps {
  roadmap: PublicRoadmapDetailData;
}

export function RoadmapDetailHero({ roadmap }: RoadmapDetailHeroProps) {
  return (
    <section className="bg-[#0F172A] py-16 text-white md:py-20">
      <Container>
        <Button
          asChild
          variant="ghost"
          className="mb-8 text-[#E9EAF0] hover:bg-white/10 hover:text-white"
        >
          <Link href="/roadmaps">
            <ArrowLeft className="size-4" />
            Back to roadmaps
          </Link>
        </Button>

        <div className="grid gap-10 lg:grid-cols-[1fr_390px] lg:items-end">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#57CC99]">
              <BadgeCheck className="size-4" />
              {roadmap.domain}
            </span>
            <h1 className="mt-6 text-4xl font-black leading-tight md:text-6xl">
              {roadmap.title}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#E9EAF0]">
              {roadmap.subtitle || roadmap.description}
            </p>
          </div>

          <aside className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.18)]">
            <div className="grid gap-3">
              <HeroStat icon={<Clock />} label="Duration" value={roadmap.duration} />
              <HeroStat icon={<LineChart />} label="Avg salary" value={roadmap.salaryRange} />
              <HeroStat icon={<Users />} label="Learner count" value="2,500+" />
            </div>
            <Button
              asChild
              className="mt-5 w-full bg-[#FF7A0E] text-white hover:bg-[#E86C0D]"
            >
              <Link href="/programs">
                Start this roadmap
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </aside>
        </div>
      </Container>
    </section>
  );
}

function HeroStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[#1E293B]/70 p-4">
      <div className="flex size-10 items-center justify-center rounded-xl bg-[#FF7A0E]/15 text-[#FF7A0E] [&_svg]:size-4">
        {icon}
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#8C94A3]">
          {label}
        </p>
        <p className="text-lg font-black text-white">{value}</p>
      </div>
    </div>
  );
}
