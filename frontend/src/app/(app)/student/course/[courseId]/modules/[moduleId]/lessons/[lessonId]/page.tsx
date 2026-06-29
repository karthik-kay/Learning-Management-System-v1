"use client";

import { useParams } from "next/navigation";
import { LessonTabs } from "./tabs/LessonTabs";

export default function LessonPage() {
  const { lessonId } = useParams();

  return (
    <div className="flex flex-col gap-4 px-6 py-4">
      {/* VIDEO CARD */}
      <div className="bg-black rounded-xl overflow-y-auto shadow-lg">
        <div className="relative w-full aspect-video">
          <iframe
            src="https://www.youtube.com/embed/wIyHSOugGGw&t=695s"
            className="absolute inset-0 w-full h-full"
            allowFullScreen
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        <LessonTabs lessonId={lessonId as string} />
      </div>
    </div>
  );
}
