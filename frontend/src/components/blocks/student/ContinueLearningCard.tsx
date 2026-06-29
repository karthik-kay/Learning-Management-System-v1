"use client";

import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Play, Clock, BookOpen } from "lucide-react";

interface ContinueLearningCardProps {
  course_id: number;
  course_title: string;
  thumbnail?: string | null;
  module_id: number;
  module_title: string;
  lesson_id: number;
  lesson_title: string;
  estimated_time_left_minutes?: number;
  unread_lessons?: number;
}

export function ContinueLearningCard({
  course_id,
  course_title,
  thumbnail,
  module_id,
  module_title,
  lesson_id,
  lesson_title,
  unread_lessons,
  estimated_time_left_minutes,
}: ContinueLearningCardProps) {
  return (
    <Card className="group relative overflow-hidden rounded-2xl py-0 border border-slate-100 bg-white transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/5 hover:-translate-y-1">
      {/* IMAGE */}
      <div className="relative h-48 w-full overflow-hidden">
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={course_title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-slate-50 flex items-center justify-center">
            <BookOpen className="text-slate-300" size={28} />
          </div>
        )}

        {/* PLAY OVERLAY */}
        <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/20 transition-colors flex items-center justify-center">
          <div className="bg-white/95 p-3 rounded-full shadow-lg opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all">
            <Play size={18} className="text-blue-600 fill-current ml-0.5" />
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="px-6 pb-6 space-y-5">
        {/* COURSE TITLE */}
        <div className="space-y-1.5">
          <Link
            href={`/student/course/${course_id}/modules/${module_id}/lessons/${lesson_id}`}
          >
            <h3 className="text-sm font-semibold text-slate-800 leading-snug line-clamp-1 hover:text-blue-600 transition-colors">
              {course_title}
            </h3>
          </Link>

          {/* MODULE · LESSON */}
          <p className="text-xs text-slate-500 flex items-center gap-2 truncate">
            <span className="font-medium">{module_title}</span>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <span className="truncate">{lesson_title}</span>
          </p>
        </div>

        {/* PROGRESS */}
        <div className="space-y-2">
          <div className="flex justify-between text-[11px] text-slate-500">
            <span>Progress</span>
            <span className="font-medium text-blue-600">60%</span>
          </div>

          <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full w-[60%] bg-blue-600 rounded-full transition-all duration-700 group-hover:bg-blue-500" />
          </div>
        </div>

        {/* META */}
        <div className="flex items-center justify-between pt-1 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            {unread_lessons !== undefined && (
              <span>{unread_lessons} lessons left</span>
            )}

            {estimated_time_left_minutes && (
              <span className="flex items-center gap-1">
                <Clock size={12} className="text-slate-400" />
                {estimated_time_left_minutes}m
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
