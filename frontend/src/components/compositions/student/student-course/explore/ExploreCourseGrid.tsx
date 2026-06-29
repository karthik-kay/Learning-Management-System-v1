"use client";

import {
  StudentCourseCard,
  StudentCourseCardSkeleton,
} from "@/components/courses/common/CourseCard";
import { PublicCourseDetail } from "@/types";

interface ExploreCourseGridProps {
  courses: PublicCourseDetail[];
  isLoading?: boolean;
}

export function ExploreCourseGrid({
  courses,
  isLoading,
}: ExploreCourseGridProps) {
  const skeletonCount = 6;

  // Empty result state
  if (!isLoading && courses.length === 0) {
    return <p className="text-center text-gray-500 py-10">No results found.</p>;
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {isLoading
        ? Array.from({ length: skeletonCount }).map((_, i) => (
            <StudentCourseCardSkeleton key={i} />
          ))
        : courses.map((course) => (
            <StudentCourseCard key={course.id} course={course} />
          ))}
    </div>
  );
}
