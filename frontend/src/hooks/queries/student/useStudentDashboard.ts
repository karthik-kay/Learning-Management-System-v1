import { useQuery } from "@tanstack/react-query";

import { studentDashboardApi } from "@/lib/api/student";
import { queryKeys } from "@/lib/query/queryKeys";

export function useStudentDashboard(params?: Record<string, string>) {
  return useQuery({
    queryKey: queryKeys.student.dashboard(params),
    queryFn: () => studentDashboardApi.get(params),
  });
}
