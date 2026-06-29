import { useQuery } from "@tanstack/react-query";

import { institutionDashboardApi } from "@/lib/api/institution";
import { queryKeys } from "@/lib/query/queryKeys";

export function useInstitutionAdminDashboard() {
  return useQuery({
    queryKey: queryKeys.institution.dashboard("admin"),
    queryFn: institutionDashboardApi.getAdmin,
  });
}

export function useInstitutionHodDashboard() {
  return useQuery({
    queryKey: queryKeys.institution.dashboard("hod"),
    queryFn: institutionDashboardApi.getHod,
  });
}
