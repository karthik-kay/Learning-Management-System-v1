"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronDown, BookOpen } from "lucide-react";
import { useState } from "react";
import { Course, Module, Lesson } from "@/types/course";

interface CourseSidebarProps {
  course: Course;
}

export default function CourseSidebar({ course }: CourseSidebarProps) {
  const { lessonId } = useParams<{ lessonId?: string }>();

  return (
    <nav className="h-full overflow-y-auto px-4 py-6 space-y-6">
      {/* COURSE TITLE */}
      <div className="sticky top-0 bg-white pb-4 z-10">
        <h2 className="text-lg font-semibold text-gray-900 leading-snug">
          {course.title}
        </h2>
        <p className="text-xs text-gray-500 mt-1">Course content</p>
      </div>

      {/* MODULES */}
      <div className="space-y-3">
        {course.modules.map((module) => (
          <ModuleSection
            key={module.id}
            module={module}
            activeLessonId={lessonId}
          />
        ))}
      </div>
    </nav>
  );
}

interface ModuleSectionProps {
  module: Module;
  activeLessonId?: string;
}

function ModuleSection({ module, activeLessonId }: ModuleSectionProps) {
  const [open, setOpen] = useState(true);

  return (
    <div className="rounded-xl border bg-white shadow-sm">
      {/* MODULE HEADER */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-800 hover:bg-gray-50 rounded-t-xl"
      >
        <span className="line-clamp-1">{module.title}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* LESSON LIST */}
      {open && (
        <ul className="px-2 pb-2 space-y-1">
          {module.lessons.map((lesson: Lesson) => {
            const isActive = String(lesson.id) === String(activeLessonId);

            return (
              <li key={lesson.id}>
                <Link
                  href={`/student/course/${module.course}/modules/${module.id}/lessons/${lesson.id}`}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition ${
                    isActive
                      ? "bg-orange-100 text-orange-700 font-medium"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <BookOpen className="w-4 h-4 shrink-0" />
                  <span className="line-clamp-1">{lesson.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
