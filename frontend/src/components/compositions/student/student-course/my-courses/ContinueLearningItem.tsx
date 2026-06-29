"use client";

import Image from "next/image";
import { Play, Download } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { ContinueLearningJoinedItem } from "@/types";

interface Props {
  item: ContinueLearningJoinedItem;
}

export function ContinueLearningItem({ item }: Props) {
  return (
    <div className="flex gap-4 rounded-xl border bg-white p-4">
      {/* THUMBNAIL */}
      <div className="relative w-28 h-20 rounded-lg bg-gray-100 overflow-hidden shrink-0">
        {item.course_thumbnail ? (
          <Image
            src={item.course_thumbnail}
            alt=""
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-xs text-gray-400">
            Course
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="flex-1 min-w-0 space-y-2">
        <div>
          <p className="font-semibold text-sm truncate">{item.lesson_title}</p>
          <p className="text-xs text-gray-500 truncate">
            {item.course_title} • {item.module}
          </p>
        </div>

        <Progress value={item.lesson_progress_percent} />

        <div className="flex items-center justify-between">
          <span className="text-[11px] text-gray-500">
            {item.lesson_progress_percent}% of lesson
          </span>

          <button className="flex items-center gap-1.5 text-sm font-medium text-orange-600">
            <Play className="h-4 w-4" />
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
