import { djangoService } from "@/services/djangoService";

export const studentEnrollmentsApi = {
  list: () => djangoService.getEnrollments(),
  completedCourses: () => djangoService.getCompletedCourses(),
  continueCourses: () => djangoService.getContinueCourses(),
  programEnrollments: () => djangoService.getStudentProgramEnrollments(),
  update: (
    id: number,
    data: Parameters<typeof djangoService.updateEnrollment>[1],
  ) => djangoService.updateEnrollment(id, data),
  complete: (id: number) => djangoService.completeEnrollment(id),
};
