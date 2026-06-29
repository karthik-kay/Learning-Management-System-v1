// Public catalog types returned by Django public APIs.

export type PublicLevel = "beginner" | "intermediate" | "advanced" | null;
export type PublicLanguage =
  | "english"
  | "hindi"
  | "telugu"
  | "tamil"
  | "other"
  | null;

export interface ActivePrice {
  base_paise: number;
  discount_paise?: number;
  final_paise?: number;
  base_inr: number;
  discount_inr?: number;
  final_inr?: number;
}

export interface PublicFacultyProfile {
  id: number;
  display_name: string;
  slug: string;
  headline: string;
  bio: string;
  avatar: string | null;
  expertise: string[];
  linkedin_url: string;
  github_url: string;
  website_url: string;
  years_experience: number;
}

export interface PublicLesson {
  id: number;
  title: string;
  order: number;
  is_preview: boolean;
  duration_minutes: number | null;
}

export interface PublicModule {
  id: number;
  title: string;
  order: number;
  description: string | null;
  lessons: PublicLesson[];
}

export interface PublicCourseProductListItem {
  id: number;
  course_id: number;
  course_slug: string;
  title: string;
  slug: string;
  short_description: string;
  thumbnail: string | null;
  promo_video_url: string | null;
  is_free: boolean;
  display_price_paise: number | null;
  instructor_name: string;
  instructors: PublicFacultyProfile[];
  domain: string | null;
  level: PublicLevel;
  language: PublicLanguage;
  estimated_hours: number | null;
  modules_count: number;
  lessons_count: number;
  is_featured: boolean;
  active_price?: ActivePrice | null;

  // Temporary compatibility fields for older course UI components.
  description?: string;
  faculty_name?: string;
  instructor_image?: string | null;
  original_price?: number | null;
  price?: number;
  course_type?: "self_paced" | "instructor_led";
}

export interface PublicCourseProductDetail
  extends PublicCourseProductListItem {
  description: string;
  modules: PublicModule[];
  published_at: string | null;
}

export interface PublicProgramCourse {
  id: number;
  course_id: number;
  title: string;
  slug: string;
  description: string;
  domain: string | null;
  level: PublicLevel;
  language: PublicLanguage;
  estimated_hours: number | null;
  modules_count: number;
  lessons_count: number;
  order: number;
  is_required: boolean;
  unlock_after_days: number;
}

export interface PublicProgramPhase {
  id: number;
  title: string;
  description: string;
  order: number;
  duration_weeks: number;
  starts_at_week: number;
  ends_at_week: number;
  courses: PublicProgramCourse[];
}

export interface PublicProgramOutcome {
  id: number;
  title: string;
  description: string;
  icon: string;
  order: number;
}

export interface PublicProgramFAQ {
  id: number;
  question: string;
  answer: string;
  order: number;
}

export interface PublicLearningProgramListItem {
  id: number;
  title: string;
  slug: string;
  subtitle: string;
  short_description: string;
  program_type: string;
  level: PublicLevel;
  duration_weeks: number;
  total_hours: number;
  thumbnail: string | null;
  promo_video_url: string | null;
  is_featured: boolean;
  order: number;
  active_price: ActivePrice | null;
  phases_count: number;
  courses_count: number;
}

export interface PublicLearningProgramDetail
  extends PublicLearningProgramListItem {
  description: string;
  published_at: string | null;
  phases: PublicProgramPhase[];
  outcomes: PublicProgramOutcome[];
  faqs: PublicProgramFAQ[];
}

export interface ProgramEnrollment {
  id: number;
  program: PublicLearningProgramListItem;
  status: string;
  progress: number;
  started_at: string;
  updated_at: string;
  completed_at: string | null;
  expires_at: string | null;
}

// Legacy aliases: migrate components to the product names gradually.
export type PublicCourseListItem = PublicCourseProductListItem;
export type PublicCourseDetail = PublicCourseProductDetail;
