import { useQuery } from "@tanstack/react-query";

import { institutionAuditApi } from "@/lib/api/institution";
import { queryKeys } from "@/lib/query/queryKeys";

export function useInstitutionAuditLogs(params?: Record<string, string>) {
  return useQuery({
    queryKey: queryKeys.institution.auditLogs(params),
    queryFn: () => institutionAuditApi.getLogs(params),
  });
}
