import { useQuery } from "@tanstack/react-query";

import { publicContentApi } from "@/lib/api/public";
import { queryKeys } from "@/lib/query/queryKeys";
import { FAQListParams } from "@/types";

export function usePublicFAQs(params?: FAQListParams) {
  return useQuery({
    queryKey: queryKeys.public.faqs(params),
    queryFn: () => publicContentApi.faqs(params),
  });
}
