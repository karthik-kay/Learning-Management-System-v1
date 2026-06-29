import { notFound } from "next/navigation";

import { Container } from "@/components/shared/primitives";
import { CareerOverviewSection } from "@/components/public/sections/roadmap/variants/CareerOverviewSection";
import { RoadmapCoursesSection } from "@/components/public/sections/roadmap/variants/RoadmapCoursesSection";
import { RoadmapCTASection } from "@/components/public/sections/roadmap/variants/RoadmapCTASection";
import { RoadmapDetailHero } from "@/components/public/sections/roadmap/variants/RoadmapDetailHero";
import { RoadmapFAQSection } from "@/components/public/sections/roadmap/variants/RoadmapFAQSection";
import { RoadmapPhaseTimeline } from "@/components/public/sections/roadmap/variants/RoadmapPhaseTimeline";
import { RoadmapSkillsSection } from "@/components/public/sections/roadmap/variants/RoadmapSkillsSection";
import { SalaryInsightsSection } from "@/components/public/sections/roadmap/variants/SalaryInsightsSection";
import {
  mapRoadmapDetailToUi,
  roadmapDetails,
} from "@/components/public/sections/roadmap/roadmapData";
import { publicService } from "@/services/public";

export default async function RoadmapDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const backendRoadmap = await publicService.getRoadmap(id).catch(() => null);
  const roadmap =
    backendRoadmap ?
      mapRoadmapDetailToUi(backendRoadmap)
    : roadmapDetails.find((item) => item.slug === id);

  if (!roadmap) {
    notFound();
  }

  return (
    <main className="bg-[#F9FAFB]">
      <RoadmapDetailHero roadmap={roadmap} />

      <Container>
        <CareerOverviewSection roadmap={roadmap} />
      </Container>

      <Container>
        <RoadmapPhaseTimeline steps={roadmap.steps} />
      </Container>

      <Container>
        <RoadmapSkillsSection roadmap={roadmap} />
      </Container>

      <Container>
        <RoadmapCoursesSection roadmap={roadmap} />
      </Container>

      <Container>
        <SalaryInsightsSection roadmap={roadmap} />
      </Container>

      <Container>
        <RoadmapFAQSection roadmap={roadmap} />
      </Container>

      <Container>
        <RoadmapCTASection title={roadmap.title} />
      </Container>
    </main>
  );
}
