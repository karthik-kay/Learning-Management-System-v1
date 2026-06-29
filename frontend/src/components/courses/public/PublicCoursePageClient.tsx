"use client";

import { usePublicCourse } from "@/context/PublicCourseContext";
import CourseTabs from "./CourseTabs";
import ProductSidebar from "./ProductSidebar";

export default function PublicCoursePageClient() {
  const { course } = usePublicCourse();

  if (!course) {
    return (
      <div className="p-10 text-center text-red-600">Course not found.</div>
    );
  }
  const isEnrolled = false;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 px-6 py-8 max-w-7xl mx-auto">
      {/* LEFT CONTENT */}
      <div className="lg:col-span-2 space-y-6">
        <h1 className="text-3xl font-bold">{course.title}</h1>
        <p className="text-gray-600">{course.description}</p>

        <CourseTabs course={course} />
      </div>

      <ProductSidebar course={course} isEnrolled={isEnrolled} />
    </div>
  );
}
