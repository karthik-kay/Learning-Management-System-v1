export interface ContinueCourseItem {
  enrollment_id: number;
  course_id: number;
  course_title: string;

  course_thumbnail?: string | null;

  course_progress_percent: number;
  completed_lessons: number;
  total_lessons: number;

  unread_lessons: number;

  lesson_id: number;
  lesson_title: string;

  module_id: number;
  module_title: string;

  estimated_time_left_minutes: number;
}

export interface CompletedCourse {
  course_id: number;
  course_title: string;
  course_thumbnail?: string | null;
  completed_at: string;
}

export interface Enrollment {
  id: number;
  student: number;
  student_name: string;

  course_id: number;
  course_title: string;
  course_thumbnail?: string | null;

  progress: number;
  completed_modules: number;
  total_modules: number;

  started_at: string;
  updated_at: string;
  completed_at: string | null;

  is_completed: boolean;
}

export interface UpdateEnrollmentData {
  progress?: number;
  completed_modules?: number;
}

// types/learning.ts
export type ContinueLearningJoinedItem = {
  lesson_id: number;
  lesson_title: string;
  module: string;

  course_id: number;
  course_title: string;
  course_thumbnail?: string | null;

  course_progress_percent: number;

  lesson_progress_percent: number;
  duration_minutes?: number | null;
};
