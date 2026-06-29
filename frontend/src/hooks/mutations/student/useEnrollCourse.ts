import { useMutation, useQueryClient } from "@tanstack/react-query";

import { studentCoursesApi } from "@/lib/api/student";
import { queryKeys } from "@/lib/query/queryKeys";

export function useEnrollCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: studentCoursesApi.enroll,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.student.enrollments(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.student.continueCourses(),
      });
    },
  });
}
