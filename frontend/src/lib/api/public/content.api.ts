import {
  BlogListParams,
  EventListParams,
  FAQListParams,
  PublicContentListParams,
  PublicPageKey,
} from "@/types";
import { publicService } from "@/services/public";

export const publicContentApi = {
  page: (pageKey: PublicPageKey) => publicService.getPublicPage(pageKey),
  faqs: (params?: FAQListParams) => publicService.getPublicFAQs(params),
  blogCategories: () => publicService.getBlogCategories(),
  blogPosts: (params?: BlogListParams) => publicService.getBlogPosts(params),
  blogPost: (slug: string) => publicService.getBlogPost(slug),
  domains: () => publicService.getPublicDomains(),
  careerPaths: (params?: PublicContentListParams) =>
    publicService.getCareerPaths(params),
  careerPath: (slug: string) => publicService.getCareerPath(slug),
  roadmaps: (params?: PublicContentListParams & { career_path?: string }) =>
    publicService.getRoadmaps(params),
  roadmap: (slug: string) => publicService.getRoadmap(slug),
  events: (params?: EventListParams) => publicService.getPublicEvents(params),
  event: (slug: string) => publicService.getPublicEvent(slug),
};
