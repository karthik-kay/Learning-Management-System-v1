// src/types/course.ts

import { Quiz } from "./quiz";

export type CourseType = "self_paced" | "instructor_led";
export type CourseLevel = "beginner" | "intermediate" | "advanced";
export type CourseLanguage = "english" | "hindi" | "telugu" | "tamil" | "other";

export interface ActivePrice {
  base_paise: number;
  discount_paise: number;
  final_paise: number;
  base_inr: number;
  discount_inr: number;
  final_inr: number;
}

export interface Lesson {
  id: number;
  title: string;
  content: string;
  order: number;
  lesson_type: "video" | "reading" | "lab";
  deadline: string | null;
  resource_url: string | null;
  resources: any[];
  duration_minutes: number;
  is_preview: boolean;
  completed?: boolean; // only present in enrolled view
}

export interface Module {
  id: number;
  title: string;
  order: number;
  deadline: string | null;
  description: string | null;
  duration_minutes: number;
  lessons: Lesson[];
}

export interface Course {
  id: number;
  title: string;
  description: string;
  faculty: number;
  faculty_name?: string; // from serializer annotation
  course_type: CourseType;
  deadline: string | null;
  created_at: string;
  updated_at: string;

  thumbnail: string | null;
  promo_video_url: string | null;
  instructor_image: string | null;

  domain: string | null;
  level: CourseLevel | null;
  language: CourseLanguage | null;

  original_price: string | null; // display only — crossed out price
  is_free: boolean;
  active_price: ActivePrice | null; // actual checkout price

  is_published: boolean;
  is_featured: boolean;

  slug: string | null;

  modules: Module[];
  quizzes?: Quiz[];
}

export interface EnrolledCourse extends Course {
  modules: Module[];
}
