import { useQuery } from "@tanstack/react-query";

import { institutionReportsApi } from "@/lib/api/institution";
import { queryKeys } from "@/lib/query/queryKeys";

export function useInstitutionAttendanceReport() {
  return useQuery({
    queryKey: queryKeys.institution.reports("attendance"),
    queryFn: institutionReportsApi.getAttendance,
  });
}

export function useInstitutionPerformanceReport() {
  return useQuery({
    queryKey: queryKeys.institution.reports("performance"),
    queryFn: institutionReportsApi.getPerformance,
  });
}

export function useInstitutionFacultyActivityReport() {
  return useQuery({
    queryKey: queryKeys.institution.reports("faculty-activity"),
    queryFn: institutionReportsApi.getFacultyActivity,
  });
}

export function useInstitutionBatchPerformanceReport() {
  return useQuery({
    queryKey: queryKeys.institution.reports("batch-performance"),
    queryFn: institutionReportsApi.getBatchPerformance,
  });
}

export function useInstitutionAtRiskStudentsReport() {
  return useQuery({
    queryKey: queryKeys.institution.reports("at-risk-students"),
    queryFn: institutionReportsApi.getAtRiskStudents,
  });
}

export function useInstitutionStudentProgressReport(
  studentId: number,
  enabled = true,
) {
  return useQuery({
    queryKey: queryKeys.institution.studentReport(studentId, "progress"),
    queryFn: () => institutionReportsApi.getStudentProgress(studentId),
    enabled: enabled && Number.isFinite(studentId),
  });
}

export function useInstitutionSubjectAttendanceReport(
  studentId: number,
  enabled = true,
) {
  return useQuery({
    queryKey: queryKeys.institution.studentReport(studentId, "attendance"),
    queryFn: () => institutionReportsApi.getSubjectAttendance(studentId),
    enabled: enabled && Number.isFinite(studentId),
  });
}
