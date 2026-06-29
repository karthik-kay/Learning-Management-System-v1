import { useQuery } from "@tanstack/react-query";

import { institutionPeopleApi } from "@/lib/api/institution";
import { queryKeys } from "@/lib/query/queryKeys";
import type { QueryParams } from "@/services/djangoService";

export function useInstitutionStudents(params?: QueryParams) {
  return useQuery({
    queryKey: queryKeys.institution.students(params),
    queryFn: () => institutionPeopleApi.getStudents(params),
  });
}

export function useInstitutionStudent(id: number, enabled = true) {
  return useQuery({
    queryKey: queryKeys.institution.student(id),
    queryFn: () => institutionPeopleApi.getStudent(id),
    enabled: enabled && Number.isFinite(id),
  });
}

export function useInstitutionFaculty(params?: QueryParams) {
  return useQuery({
    queryKey: queryKeys.institution.faculty(params),
    queryFn: () => institutionPeopleApi.getFaculty(params),
  });
}

export function useInstitutionFacultyDetail(id: number, enabled = true) {
  return useQuery({
    queryKey: queryKeys.institution.facultyDetail(id),
    queryFn: () => institutionPeopleApi.getFacultyDetail(id),
    enabled: enabled && Number.isFinite(id),
  });
}
