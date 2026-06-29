import { publicService } from "@/services/public";

export const publicCoursesApi = {
  list: () => publicService.getPublicCourseProducts(),
  detail: (slugOrCourseId: string | number) =>
    publicService.getPublicCourse(slugOrCourseId),
};
