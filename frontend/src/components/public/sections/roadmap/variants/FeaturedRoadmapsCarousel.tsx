import { FeaturedRoadmap } from "./FeaturedRoadmap";
import { PublicRoadmapCardData } from "../roadmapData";

interface FeaturedRoadmapsCarouselProps {
  roadmaps: PublicRoadmapCardData[];
}

export function FeaturedRoadmapsCarousel({
  roadmaps,
}: FeaturedRoadmapsCarouselProps) {
  const featuredRoadmap = roadmaps[0];

  if (!featuredRoadmap) return null;

  return (
    <section className="bg-[#F9FAFB] py-16">
      <div className="mb-7 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#38A3A5]">
            Featured paths
          </p>
          <h2 className="mt-3 text-3xl font-black text-[#0F172A] md:text-4xl">
            Curated roadmaps to start with
          </h2>
        </div>
        <p className="max-w-xl text-sm leading-6 text-[#6B7280]">
          Editorial picks for learners who want the strongest starting points
          across software, AI, data, cloud, and security.
        </p>
      </div>

      <FeaturedRoadmap roadmap={featuredRoadmap} />
    </section>
  );
}
