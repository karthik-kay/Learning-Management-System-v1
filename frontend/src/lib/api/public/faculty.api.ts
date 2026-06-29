import { publicService } from "@/services/public";

export const publicFacultyApi = {
  list: () => publicService.getPublicFaculty(),
  detail: (slug: string) => publicService.getPublicFacultyProfile(slug),
};
