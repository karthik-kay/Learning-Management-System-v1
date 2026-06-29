import { useQuery } from "@tanstack/react-query";

import { publicContentApi } from "@/lib/api/public";
import { queryKeys } from "@/lib/query/queryKeys";
import { BlogListParams } from "@/types";

export function useBlogCategories() {
  return useQuery({
    queryKey: queryKeys.public.blogCategories(),
    queryFn: publicContentApi.blogCategories,
  });
}

export function useBlogPosts(params?: BlogListParams) {
  return useQuery({
    queryKey: queryKeys.public.blogPosts(params),
    queryFn: () => publicContentApi.blogPosts(params),
  });
}

export function useBlogPost(slug: string) {
  return useQuery({
    queryKey: queryKeys.public.blogPost(slug),
    queryFn: () => publicContentApi.blogPost(slug),
    enabled: Boolean(slug),
  });
}
