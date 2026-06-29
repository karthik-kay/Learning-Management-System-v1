export function generateLessonHref({
  courseId,
  moduleId,
  lessonId,
}: {
  courseId: number | string;
  moduleId: number | string;
  lessonId: number | string;
}): string {
  if (!courseId || !moduleId || !lessonId) {
    console.error("Missing ID(s) when generating lesson link:", {
      courseId,
      moduleId,
      lessonId,
    });
    return "/explore";
  }

  return `/student/course/${courseId}/modules/${moduleId}/lessons/${lessonId}`;
}

export const EXPLORE_PAGE_HREF = "/student/courses/explore";
