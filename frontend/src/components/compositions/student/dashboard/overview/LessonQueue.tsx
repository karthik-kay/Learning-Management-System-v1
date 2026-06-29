"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { djangoService } from "@/services/djangoService";
import { LessonQueueItem as LessonQueueItemType } from "@/types/learning";
import { LessonQueueItem } from "../../../../blocks/student/LessonQueueItem";
import { Loader2 } from "lucide-react";

export function LessonQueue() {
  const [queue, setQueue] = useState<LessonQueueItemType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    djangoService
      .getLessonQueue()
      .then((res) => setQueue(res.queue))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="rounded-2xl border bg-white shadow-sm">
      {/* ---------- HEADER ---------- */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h3 className="text-sm font-semibold text-text-primary">
          Upcoming Lesson Queue
        </h3>

        <div className="flex items-center gap-1 text-xs text-text-muted">
          <Clock className="h-3 w-3" />
          {queue.length} lessons scheduled
        </div>
      </div>

      {/* ---------- CONTENT ---------- */}
      <div className="px-4 py-3">
        {loading && (
          <div className="flex items-center justify-center py-10 gap-2 text-text-muted">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Loading lessons…</span>
          </div>
        )}

        {!loading && queue.length === 0 && (
          <div className="py-10 text-center text-sm text-text-muted">
            You’re all caught up 🎉
          </div>
        )}

        {!loading && queue.length > 0 && (
          <div className="flex flex-col gap-3">
            {queue.map((lesson, index) => (
              <LessonQueueItem
                key={lesson.id}
                lesson={lesson}
                index={index}
                className="lesson-queue-item lesson-queue-item--next"
                onContinue={() => {
                  // router.push(`/lessons/${lesson.id}`)
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* ---------- FOOTER ---------- */}
      {!loading && queue.length > 0 && (
        <div className="flex items-center justify-between px-6 py-4 border-t">
          <button className="text-sm font-medium text-secondary hover:underline">
            View Full Schedule
          </button>

          <button className="px-4 py-2 rounded-lg bg-gray-100 text-sm font-medium text-text-primary hover:bg-gray-200 transition">
            Manage Queue
          </button>
        </div>
      )}
    </div>
  );
}
