"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { RecommendationCourseCard } from "./RecommendationCourseCard";

interface Course {
  id: number;
  title: string;
  thumbnail: string;
  category: string;
  rating: number;
  hours: number;
}

interface Props {
  courses: Course[];
}

export function RecommendationsCarousel({ courses }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!ref.current) return;
    ref.current.scrollBy({
      left: dir === "left" ? -320 : 320,
      behavior: "smooth",
    });
  };

  if (!courses.length) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Recommended for you</h2>

        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="p-2 rounded-full border hover:bg-gray-100"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-2 rounded-full border hover:bg-gray-100"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div ref={ref} className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
        {courses.map((course) => (
          <RecommendationCourseCard key={course.id} {...course} />
        ))}
      </div>
    </section>
  );
}
