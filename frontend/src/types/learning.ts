export type LessonType = "video" | "reading" | "lab";

export interface LessonQueueItem {
  id: number;
  title: string;
  module: string;
  course_id: number;
  lesson_type: LessonType;
  duration_minutes?: number;
}

export interface LessonQueueResponse {
  mode: "auto" | "custom";
  queue: LessonQueueItem[];
}
