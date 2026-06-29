import { useQuery } from "@tanstack/react-query";

import { publicContentApi } from "@/lib/api/public";
import { queryKeys } from "@/lib/query/queryKeys";
import { EventListParams } from "@/types";

export function usePublicEvents(params?: EventListParams) {
  return useQuery({
    queryKey: queryKeys.public.events(params),
    queryFn: () => publicContentApi.events(params),
  });
}

export function usePublicEvent(slug: string) {
  return useQuery({
    queryKey: queryKeys.public.event(slug),
    queryFn: () => publicContentApi.event(slug),
    enabled: Boolean(slug),
  });
}
