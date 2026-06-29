"use client";

import { useMemo, useState } from "react";

import { Container } from "@/components/shared/primitives";
import { FeaturedRoadmapsCarousel } from "@/components/public/sections/roadmap/variants/FeaturedRoadmapsCarousel";
import { RoadmapCategorySection } from "@/components/public/sections/roadmap/variants/RoadmapCategorySection";
import { RoadmapFilterBar } from "@/components/public/sections/roadmap/variants/RoadmapFilterBar";
import { RoadmapsHero } from "@/components/public/sections/roadmap/variants/RoadmapsHero";
import { WhyRoadmapsSection } from "@/components/public/sections/roadmap/variants/WhyRoadmapsSection";
import {
  mapRoadmapListItemToCard,
  roadmapCards,
} from "@/components/public/sections/roadmap/roadmapData";
import { usePublicDomains, useRoadmaps } from "@/hooks/queries/public";

export function RoadmapsCatalog() {
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState("All");
  const { data: backendRoadmaps, isLoading } = useRoadmaps({
    search: search || undefined,
  });
  const { data: backendDomains } = usePublicDomains();

  const baseRoadmaps = useMemo(() => {
    if (backendRoadmaps?.length) {
      return backendRoadmaps.map(mapRoadmapListItemToCard);
    }

    return roadmapCards;
  }, [backendRoadmaps]);

  const filteredRoadmaps = useMemo(() => {
    return baseRoadmaps.filter((roadmap) => {
      const query = search.toLowerCase();
      const matchesSearch =
        !query ||
        roadmap.title.toLowerCase().includes(query) ||
        roadmap.description.toLowerCase().includes(query) ||
        roadmap.domain.toLowerCase().includes(query) ||
        roadmap.skills.some((skill) => skill.toLowerCase().includes(query));
      const matchesDifficulty =
        difficulty === "All" ||
        roadmap.level.toLowerCase().includes(difficulty.toLowerCase());
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(roadmap.domain);

      return matchesSearch && matchesDifficulty && matchesCategory;
    });
  }, [baseRoadmaps, difficulty, search, selectedCategories]);

  const categoryOrder = useMemo(() => {
    const dynamicDomains = backendDomains?.map((item) => item.title) ?? [];
    const roadmapDomains = Array.from(
      new Set(baseRoadmaps.map((roadmap) => roadmap.domain)),
    );

    return Array.from(new Set([...dynamicDomains, ...roadmapDomains])).filter(
      Boolean,
    );
  }, [backendDomains, baseRoadmaps]);

  const groupedRoadmaps = useMemo(() => {
    return categoryOrder
      .map((category) => ({
        category,
        roadmaps: filteredRoadmaps.filter(
          (roadmap) => roadmap.domain === category,
        ),
      }))
      .filter((group) => group.roadmaps.length);
  }, [categoryOrder, filteredRoadmaps]);

  return (
    <>
      <RoadmapsHero
        totalRoadmaps={baseRoadmaps.length}
        search={search}
        onSearchChange={setSearch}
      />

      <WhyRoadmapsSection />

      <section className="bg-[#F9FAFB]">
        <Container>
          <FeaturedRoadmapsCarousel roadmaps={baseRoadmaps.slice(0, 4)} />
        </Container>
      </section>

      <section id="roadmap-categories" className="bg-[#F9FAFB] pb-20">
        <Container>
          <RoadmapFilterBar
            categories={categoryOrder}
            selectedCategories={selectedCategories}
            onSelectedCategoriesChange={setSelectedCategories}
            difficulty={difficulty}
            onDifficultyChange={setDifficulty}
          />

          {isLoading ? (
            <div className="grid gap-4 py-10 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-[210px] animate-pulse rounded-2xl border border-[#E9EAF0] bg-white"
                />
              ))}
            </div>
          ) : null}

          {!isLoading && filteredRoadmaps.length === 0 ? (
            <div className="mt-10 rounded-3xl border border-[#E9EAF0] bg-white p-10 text-center shadow-sm">
              <h3 className="text-xl font-black text-[#0F172A]">
                No roadmaps found
              </h3>
              <p className="mt-2 text-sm text-[#6B7280]">
                Try a different search term or choose another difficulty.
              </p>
            </div>
          ) : null}
        </Container>

        {!isLoading
          ? groupedRoadmaps.map((group) => (
              <RoadmapCategorySection
                key={group.category}
                title={group.category}
                description={getCategoryDescription(group.category)}
                roadmaps={group.roadmaps}
              />
            ))
          : null}
      </section>
    </>
  );
}

function getCategoryDescription(category: string) {
  const descriptions: Record<string, string> = {
    "Full Stack":
      "Build full-stack web applications across frontend, backend, databases, APIs, deployment, and product-ready workflows.",
    "Web Development":
      "Master the systems behind modern web products, from interfaces and APIs to cloud deployment and performance.",
    AI: "Learn how intelligent products are built with Python, ML systems, applied AI workflows, and production model thinking.",
    "AI/ML":
      "Learn how intelligent products are built with Python, ML systems, applied AI workflows, and production model thinking.",
    "Data Science":
      "Turn raw information into decisions using analytics, statistics, machine learning, dashboards, and business storytelling.",
    "Data Engineering":
      "Design pipelines, warehouses, transformations, and data systems that keep modern teams running reliably.",
    DevOps:
      "Learn the infrastructure, automation, observability, and deployment practices that keep software production-ready.",
    Cybersecurity:
      "Build security fundamentals across networks, applications, identity, risk, and incident-ready thinking.",
    Security:
      "Build security fundamentals across networks, applications, identity, risk, and incident-ready thinking.",
  };

  return (
    descriptions[category] ??
    "Explore a focused learning path with role-ready skills, tools, projects, and career outcomes."
  );
}
