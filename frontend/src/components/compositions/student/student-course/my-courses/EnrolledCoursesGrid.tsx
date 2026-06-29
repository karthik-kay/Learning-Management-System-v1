"use client";

import {
  EnrolledCourseCard,
  EnrolledCourseCardSkeleton,
} from "@/components/courses/common/CourseCard";
import { ContinueCourseItem } from "@/types/enrollment";

interface EnrolledCoursesGridProps {
  courses: ContinueCourseItem[];
  isLoading?: boolean;
}

export function EnrolledCoursesGrid({
  courses,
  isLoading,
}: EnrolledCoursesGridProps) {
  const skeletonCount = 6;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
      {isLoading
        ? Array.from({ length: skeletonCount }).map((_, i) => (
            <EnrolledCourseCardSkeleton key={i} />
          ))
        : courses.map((course) => (
            <EnrolledCourseCard key={course.course_id} course={course} />
          ))}
    </div>
  );
}
