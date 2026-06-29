import { publicService } from "@/services/public";

export const publicProgramsApi = {
  list: () => publicService.getPublicPrograms(),
  detail: (slug: string) => publicService.getPublicProgram(slug),
};
