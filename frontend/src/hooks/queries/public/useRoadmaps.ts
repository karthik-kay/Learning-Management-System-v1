import { useQuery } from "@tanstack/react-query";

import { publicContentApi } from "@/lib/api/public";
import { queryKeys } from "@/lib/query/queryKeys";
import { PublicContentListParams } from "@/types";

export function useRoadmaps(
  params?: PublicContentListParams & { career_path?: string },
) {
  return useQuery({
    queryKey: queryKeys.public.roadmaps(params),
    queryFn: () => publicContentApi.roadmaps(params),
  });
}

export function useRoadmap(slug: string) {
  return useQuery({
    queryKey: queryKeys.public.roadmap(slug),
    queryFn: () => publicContentApi.roadmap(slug),
    enabled: Boolean(slug),
  });
}
