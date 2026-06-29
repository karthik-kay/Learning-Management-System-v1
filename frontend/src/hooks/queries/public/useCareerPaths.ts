import { useQuery } from "@tanstack/react-query";

import { publicContentApi } from "@/lib/api/public";
import { queryKeys } from "@/lib/query/queryKeys";
import { PublicContentListParams } from "@/types";

export function useCareerPaths(params?: PublicContentListParams) {
  return useQuery({
    queryKey: queryKeys.public.careerPaths(params),
    queryFn: () => publicContentApi.careerPaths(params),
  });
}

export function useCareerPath(slug: string) {
  return useQuery({
    queryKey: queryKeys.public.careerPath(slug),
    queryFn: () => publicContentApi.careerPath(slug),
    enabled: Boolean(slug),
  });
}
