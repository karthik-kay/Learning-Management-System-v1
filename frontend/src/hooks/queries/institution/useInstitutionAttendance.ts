import { useQuery } from "@tanstack/react-query";

import { institutionAttendanceApi } from "@/lib/api/institution";
import { queryKeys } from "@/lib/query/queryKeys";

export function useInstitutionAttendanceSessions() {
  return useQuery({
    queryKey: queryKeys.institution.attendanceSessions(),
    queryFn: () => institutionAttendanceApi.getSessions(),
  });
}

export function useInstitutionAttendanceRecords() {
  return useQuery({
    queryKey: queryKeys.institution.attendanceRecords(),
    queryFn: () => institutionAttendanceApi.getRecords(),
  });
}

export function useInstitutionAttendanceShortages() {
  return useQuery({
    queryKey: queryKeys.institution.attendanceShortages(),
    queryFn: () => institutionAttendanceApi.getShortages(),
  });
}

export function useInstitutionLeaveApplications(
  params?: Record<string, string>,
) {
  return useQuery({
    queryKey: queryKeys.institution.leaveApplications(params),
    queryFn: () => institutionAttendanceApi.getLeaveApplications(params),
  });
}
