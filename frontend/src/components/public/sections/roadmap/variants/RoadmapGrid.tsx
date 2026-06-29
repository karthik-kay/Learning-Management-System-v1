import { RoadmapCard } from "@/components/public/widgets/cards/RoadmapCard";
import { PublicRoadmapCardData } from "../roadmapData";

interface RoadmapGridProps {
  roadmaps: PublicRoadmapCardData[];
}

export function RoadmapGrid({ roadmaps }: RoadmapGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {roadmaps.map((roadmap) => (
        <RoadmapCard key={roadmap.slug} roadmap={roadmap} />
      ))}
    </div>
  );
}
