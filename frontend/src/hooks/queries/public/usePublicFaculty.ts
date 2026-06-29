import { useQuery } from "@tanstack/react-query";

import { publicFacultyApi } from "@/lib/api/public";
import { queryKeys } from "@/lib/query/queryKeys";

export function usePublicFaculty() {
  return useQuery({
    queryKey: queryKeys.public.faculty(),
    queryFn: publicFacultyApi.list,
  });
}

export function usePublicFacultyProfile(slug: string) {
  return useQuery({
    queryKey: queryKeys.public.facultyProfile(slug),
    queryFn: () => publicFacultyApi.detail(slug),
    enabled: Boolean(slug),
  });
}
