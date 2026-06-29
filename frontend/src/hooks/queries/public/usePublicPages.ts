import { useQuery } from "@tanstack/react-query";

import { publicContentApi } from "@/lib/api/public";
import { queryKeys } from "@/lib/query/queryKeys";
import { PublicPageKey } from "@/types";

export function usePublicPage(pageKey: PublicPageKey) {
  return useQuery({
    queryKey: queryKeys.public.page(pageKey),
    queryFn: () => publicContentApi.page(pageKey),
    enabled: Boolean(pageKey),
  });
}
