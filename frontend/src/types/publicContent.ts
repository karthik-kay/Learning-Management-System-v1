export type PublicContentStatus = "draft" | "published" | "archived";
export type PublicPageKey =
  | "home"
  | "programs"
  | "career_paths"
  | "roadmaps"
  | "certifications"
  | "events"
  | "blog"
  | "about"
  | "contact"
  | "privacy"
  | "terms"
  | "refund";

export type PublicContentDomain =
  | "full_stack"
  | "data"
  | "ai"
  | "devops"
  | "security"
  | "product"
  | "design"
  | "system_design"
  | "other";

export type PublicContentLevel = "beginner" | "intermediate" | "advanced";
export type PublicEventType =
  | "webinar"
  | "workshop"
  | "exam"
  | "bounty"
  | "hackathon"
  | "community";

export interface PublicDomain {
  id: number;
  title: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  is_featured: boolean;
  display_order: number;
  payload: Record<string, unknown>;
}

export interface PublicContentBlock {
  id: number;
  section_key: string;
  title: string;
  subtitle: string;
  body: string;
  eyebrow: string;
  image_url: string;
  cta_label: string;
  cta_url: string;
  payload: Record<string, unknown>;
  display_order: number;
}

export interface PublicFAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
  page_key?: PublicPageKey;
  display_order: number;
}

export interface PublicPageContent {
  id: number;
  page_key: PublicPageKey;
  title: string;
  slug: string;
  meta_title: string;
  meta_description: string;
  hero_eyebrow: string;
  hero_title: string;
  hero_subtitle: string;
  primary_cta_label: string;
  primary_cta_url: string;
  secondary_cta_label: string;
  secondary_cta_url: string;
  payload: Record<string, unknown>;
  published_at: string | null;
  blocks: PublicContentBlock[];
  faqs: PublicFAQ[];
}

export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  display_order: number;
}

export interface BlogPostListItem {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  cover_image_url: string;
  author_name: string;
  category: BlogCategory | null;
  tags: string[];
  reading_time_minutes: number;
  is_featured: boolean;
  display_order: number;
  published_at: string | null;
  meta_title: string;
  meta_description: string;
}

export interface BlogPostDetail extends BlogPostListItem {
  body: string;
}

export interface LinkedPublicProgram {
  id: number;
  title: string;
  slug: string;
  subtitle: string;
  program_type: string;
  level: string;
}

export interface LinkedPublicCourseProduct {
  id: number;
  title: string;
  slug: string;
  short_description: string;
}

export interface CareerPathStage {
  id: number;
  title: string;
  description: string;
  expected_salary_lpa: string | null;
  display_order: number;
  payload: Record<string, unknown>;
}

export interface CareerPathListItem {
  id: number;
  title: string;
  slug: string;
  subtitle: string;
  short_description: string;
  domain: string | null;
  domain_title?: string;
  role_family: string;
  level: PublicContentLevel;
  demand_label: string;
  opportunity_count_label: string;
  average_salary_lpa: string | null;
  salary_min_lpa: string | null;
  salary_max_lpa: string | null;
  hiring_companies: string[];
  skills: string[];
  tools: string[];
  responsibilities: string[];
  prerequisites: string[];
  highlights: string[];
  is_featured: boolean;
  display_order: number;
  published_at: string | null;
  stages_count: number;
  payload: Record<string, unknown>;
}

export interface CareerPathDetail extends CareerPathListItem {
  description: string;
  stages: CareerPathStage[];
  recommended_programs: LinkedPublicProgram[];
  recommended_courses: LinkedPublicCourseProduct[];
  related_roadmaps: RoadmapListItem[];
}

export interface RoadmapStep {
  id: number;
  track: number | null;
  title: string;
  description: string;
  stage_type: string;
  duration_label: string;
  concepts: string[];
  skills: string[];
  tools: string[];
  projects: Array<Record<string, unknown>>;
  resources: Array<Record<string, unknown>>;
  display_order: number;
  payload: Record<string, unknown>;
}

export interface RoadmapTrack {
  id: number;
  title: string;
  slug: string;
  description: string;
  focus_area: string;
  skills: string[];
  tools: string[];
  display_order: number;
  payload: Record<string, unknown>;
  steps: RoadmapStep[];
}

export interface RoadmapListItem {
  id: number;
  title: string;
  slug: string;
  subtitle: string;
  description: string;
  domain: string | null;
  domain_title?: string;
  roadmap_type: "domain" | "role" | "skill" | "track";
  level: PublicContentLevel;
  estimated_duration_weeks: number;
  skills: string[];
  tools: string[];
  outcomes: string[];
  is_featured: boolean;
  display_order: number;
  published_at: string | null;
  steps_count: number;
  tracks_count: number;
  payload: Record<string, unknown>;
}

export interface RoadmapDetail extends RoadmapListItem {
  steps: RoadmapStep[];
  tracks: RoadmapTrack[];
  related_career_paths: CareerPathListItem[];
  recommended_programs: LinkedPublicProgram[];
  recommended_courses: LinkedPublicCourseProduct[];
}

export interface PublicEventListItem {
  id: number;
  title: string;
  slug: string;
  event_type: PublicEventType;
  short_description: string;
  starts_at: string | null;
  ends_at: string | null;
  mentor_name: string;
  location_label: string;
  register_url: string;
  prize_pool: string;
  team_size: string;
  is_featured: boolean;
  display_order: number;
  published_at: string | null;
  payload: Record<string, unknown>;
}

export interface PublicEventDetail extends PublicEventListItem {
  description: string;
  related_programs: LinkedPublicProgram[];
  related_courses: LinkedPublicCourseProduct[];
}

export interface PublicContentListParams {
  search?: string;
  domain?: string;
  level?: string;
  featured?: boolean;
}

export interface BlogListParams {
  search?: string;
  category?: string;
  tag?: string;
  featured?: boolean;
}

export interface FAQListParams {
  search?: string;
  page?: PublicPageKey;
  category?: string;
}

export interface EventListParams {
  search?: string;
  event_type?: PublicEventType;
  featured?: boolean;
}
