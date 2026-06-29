"use client";

import { Clock, Play, BookOpen, FlaskConical, Video } from "lucide-react";
import { LessonQueueItem as LessonQueueItemType } from "@/types/learning";
import { Inline, Stack, Box } from "@/components/shared/primitives";

interface LessonQueueItemProps {
  lesson: LessonQueueItemType;
  index?: number;
  className?: string;
  onContinue?: () => void;
}

const LESSON_TYPE_META = {
  video: {
    label: "Video",
    Icon: Video,
    className: "bg-blue-100 text-blue-700",
  },
  reading: {
    label: "Reading",
    Icon: BookOpen,
    className: "bg-blue-100 text-blue-700",
  },
  lab: {
    label: "Lab",
    Icon: FlaskConical,
    className: "bg-purple-100 text-purple-700",
  },
} as const;

export function LessonQueueItem({
  lesson,
  index,
  onContinue,
  className,
}: LessonQueueItemProps) {
  const meta = LESSON_TYPE_META[lesson.lesson_type];

  return (
    <Box className={`lesson-queue-item ${className ?? ""}`}>
      <Inline
        justify="between"
        align="center"
        gap={16}
        className="lesson-queue-item__row"
      >
        {/* LEFT */}
        <Inline align="center" gap={16} className="lesson-queue-item__left">
          {index !== undefined && (
            <Box className="lesson-queue-item__index">{index + 1}</Box>
          )}

          <Stack gap={4} className="lesson-queue-item__content">
            <div className="lesson-queue-item__title">{lesson.title}</div>

            <div className="lesson-queue-item__module">{lesson.module}</div>

            {lesson.duration_minutes && (
              <Inline
                align="center"
                justify="start"
                gap={8}
                className="lesson-queue-item__duration"
              >
                <Clock />
                <span>{lesson.duration_minutes} min</span>
              </Inline>
            )}
          </Stack>
        </Inline>

        {/* RIGHT */}
        <Inline align="center" gap={12} className="lesson-queue-item__right">
          <Inline
            align="center"
            gap={4}
            className={`lesson-queue-item__type} ${meta.className}`}
          >
            <meta.Icon />
            <span>{meta.label}</span>
          </Inline>

          <button onClick={onContinue} className="lesson-queue-item__action">
            <Play />
          </button>
        </Inline>
      </Inline>
    </Box>
  );
}
