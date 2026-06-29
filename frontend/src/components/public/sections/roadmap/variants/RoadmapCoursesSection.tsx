import { ArrowUpRight, BookOpen } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  PublicRoadmapCourseData,
  PublicRoadmapDetailData,
} from "../roadmapData";

interface RoadmapCoursesSectionProps {
  roadmap: PublicRoadmapDetailData;
}

export function RoadmapCoursesSection({ roadmap }: RoadmapCoursesSectionProps) {
  const courses = roadmap.courses?.length
    ? roadmap.courses
    : buildFallbackCourses(roadmap);

  return (
    <section className="bg-white py-20">
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#38A3A5]">
            Courses
          </p>
          <h2 className="mt-3 text-3xl font-black text-[#0F172A] md:text-4xl">
            LearnerSlate courses inside this path
          </h2>
        </div>
        <Button asChild variant="outline" className="border-[#E9EAF0]">
          <Link href="/programs">
            Compare programs
            <ArrowUpRight className="size-4" />
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {courses.map((course) => (
          <article
            key={course.slug}
            className="rounded-2xl border border-[#E9EAF0] bg-[#F9FAFB] p-5"
          >
            <div className="flex items-start gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#0F172A] text-white">
                <BookOpen className="size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-black text-[#0F172A]">
                  {course.title}
                </h3>
                <p className="mt-1 text-sm font-semibold text-[#6B7280]">
                  {course.instructor}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {[course.duration, course.level].map((item) => (
                    <span
                      key={item}
                      className="rounded-full bg-white px-3 py-1 text-xs font-bold text-[#22577A]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function buildFallbackCourses(
  roadmap: PublicRoadmapDetailData,
): PublicRoadmapCourseData[] {
  return roadmap.steps.slice(0, 4).map((step, index) => ({
    title: step.title,
    slug: `${roadmap.slug}-${index + 1}`,
    instructor: "LearnerSlate Mentor",
    duration: step.duration,
    level: roadmap.level,
  }));
}
