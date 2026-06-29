import { useQuery } from "@tanstack/react-query";

import { publicContentApi } from "@/lib/api/public";
import { queryKeys } from "@/lib/query/queryKeys";

export function usePublicDomains() {
  return useQuery({
    queryKey: queryKeys.public.domains(),
    queryFn: publicContentApi.domains,
  });
}
