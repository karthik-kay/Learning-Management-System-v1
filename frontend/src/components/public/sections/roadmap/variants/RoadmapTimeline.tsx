import { RoadmapNode } from "@/components/public/widgets/display/RoadmapNode";
import { PublicRoadmapStepData } from "../roadmapData";

interface RoadmapTimelineProps {
  steps: PublicRoadmapStepData[];
}

export function RoadmapTimeline({ steps }: RoadmapTimelineProps) {
  return (
    <div className="relative space-y-5">
      <div className="absolute left-6 top-8 hidden h-[calc(100%-4rem)] w-px bg-[#E9EAF0] md:block" />
      {steps.map((step, index) => (
        <RoadmapNode key={step.title} step={step} index={index} />
      ))}
    </div>
  );
}
