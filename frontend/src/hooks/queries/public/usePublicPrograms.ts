import { useQuery } from "@tanstack/react-query";

import { publicProgramsApi } from "@/lib/api/public";
import { queryKeys } from "@/lib/query/queryKeys";

export function usePublicPrograms() {
  return useQuery({
    queryKey: queryKeys.public.programs(),
    queryFn: publicProgramsApi.list,
  });
}

export function usePublicProgram(slug: string) {
  return useQuery({
    queryKey: queryKeys.public.program(slug),
    queryFn: () => publicProgramsApi.detail(slug),
    enabled: Boolean(slug),
  });
}
