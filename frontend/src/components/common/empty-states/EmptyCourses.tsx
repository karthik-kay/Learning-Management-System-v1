"use client";

interface EmptyCoursesProps {
  message: string;
}

export function EmptyCourses({ message }: EmptyCoursesProps) {
  return (
    <div className="py-20 text-center text-gray-500 text-lg">
      {message || "No courses available."}
    </div>
  );
}
