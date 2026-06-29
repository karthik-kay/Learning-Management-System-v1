import { useMutation, useQueryClient } from "@tanstack/react-query";

import { studentCoursesApi } from "@/lib/api/student";
import { queryKeys } from "@/lib/query/queryKeys";

export function useCompleteLesson(courseId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (lessonId: number) =>
      studentCoursesApi.completeLesson(courseId, lessonId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.student.continueCourses(),
      });
    },
  });
}
