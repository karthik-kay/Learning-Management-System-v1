import { djangoService } from "@/services/djangoService";

export const studentCoursesApi = {
  enroll: (courseId: number) => djangoService.enrollInCourse(courseId),
  progress: (courseId: number) => djangoService.getCourseProgress(courseId),
  completeLesson: (courseId: number, lessonId: number) =>
    djangoService.completeLesson(courseId, lessonId),
  resume: (courseId: number) => djangoService.resumeCourse(courseId),
};
