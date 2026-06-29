import { useQuery } from "@tanstack/react-query";

import { studentEnrollmentsApi } from "@/lib/api/student";
import { queryKeys } from "@/lib/query/queryKeys";

export function useEnrollments() {
  return useQuery({
    queryKey: queryKeys.student.enrollments(),
    queryFn: studentEnrollmentsApi.list,
  });
}

export function useCompletedCourses() {
  return useQuery({
    queryKey: queryKeys.student.completedCourses(),
    queryFn: studentEnrollmentsApi.completedCourses,
  });
}

export function useContinueCourses() {
  return useQuery({
    queryKey: queryKeys.student.continueCourses(),
    queryFn: studentEnrollmentsApi.continueCourses,
  });
}

export function useProgramEnrollments() {
  return useQuery({
    queryKey: queryKeys.student.programEnrollments(),
    queryFn: studentEnrollmentsApi.programEnrollments,
  });
}
