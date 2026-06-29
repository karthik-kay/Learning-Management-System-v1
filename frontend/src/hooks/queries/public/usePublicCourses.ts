import { useQuery } from "@tanstack/react-query";

import { publicCoursesApi } from "@/lib/api/public";
import { queryKeys } from "@/lib/query/queryKeys";

export function usePublicCourseProducts() {
  return useQuery({
    queryKey: queryKeys.public.courseProducts(),
    queryFn: publicCoursesApi.list,
  });
}

export function usePublicCourseProduct(slugOrCourseId: string | number) {
  return useQuery({
    queryKey: queryKeys.public.courseProduct(slugOrCourseId),
    queryFn: () => publicCoursesApi.detail(slugOrCourseId),
    enabled: Boolean(slugOrCourseId),
  });
}
