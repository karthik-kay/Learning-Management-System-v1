import { useQuery } from "@tanstack/react-query";

import { institutionExportsApi } from "@/lib/api/institution";
import { queryKeys } from "@/lib/query/queryKeys";

export function useInstitutionExports(params?: Record<string, string>) {
  return useQuery({
    queryKey: queryKeys.institution.exports(params),
    queryFn: () => institutionExportsApi.getJobs(params),
  });
}

export function useInstitutionExport(id: number, enabled = true) {
  return useQuery({
    queryKey: queryKeys.institution.exportJob(id),
    queryFn: () => institutionExportsApi.getJob(id),
    enabled: enabled && Number.isFinite(id),
  });
}
