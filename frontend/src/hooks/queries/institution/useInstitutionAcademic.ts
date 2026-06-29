import { useQuery } from "@tanstack/react-query";

import { institutionAcademicApi } from "@/lib/api/institution";
import { queryKeys } from "@/lib/query/queryKeys";

export function useInstitutionDegrees() {
  return useQuery({
    queryKey: queryKeys.institution.degrees(),
    queryFn: () => institutionAcademicApi.getDegrees(),
  });
}

export function useInstitutionDepartments() {
  return useQuery({
    queryKey: queryKeys.institution.departments(),
    queryFn: () => institutionAcademicApi.getDepartments(),
  });
}

export function useInstitutionDepartment(id: number, enabled = true) {
  return useQuery({
    queryKey: queryKeys.institution.department(id),
    queryFn: () => institutionAcademicApi.getDepartment(id),
    enabled: enabled && Number.isFinite(id),
  });
}

export function useInstitutionPrograms() {
  return useQuery({
    queryKey: queryKeys.institution.programs(),
    queryFn: () => institutionAcademicApi.getPrograms(),
  });
}

export function useInstitutionProgram(id: number, enabled = true) {
  return useQuery({
    queryKey: queryKeys.institution.program(id),
    queryFn: () => institutionAcademicApi.getProgram(id),
    enabled: enabled && Number.isFinite(id),
  });
}

export function useInstitutionBatches() {
  return useQuery({
    queryKey: queryKeys.institution.batches(),
    queryFn: () => institutionAcademicApi.getBatches(),
  });
}

export function useInstitutionBatch(id: number, enabled = true) {
  return useQuery({
    queryKey: queryKeys.institution.batch(id),
    queryFn: () => institutionAcademicApi.getBatch(id),
    enabled: enabled && Number.isFinite(id),
  });
}

export function useInstitutionSections() {
  return useQuery({
    queryKey: queryKeys.institution.sections(),
    queryFn: () => institutionAcademicApi.getSections(),
  });
}

export function useInstitutionSection(id: number, enabled = true) {
  return useQuery({
    queryKey: queryKeys.institution.section(id),
    queryFn: () => institutionAcademicApi.getSection(id),
    enabled: enabled && Number.isFinite(id),
  });
}

export function useInstitutionSubjects() {
  return useQuery({
    queryKey: queryKeys.institution.subjects(),
    queryFn: () => institutionAcademicApi.getSubjects(),
  });
}

export function useInstitutionSubject(id: number, enabled = true) {
  return useQuery({
    queryKey: queryKeys.institution.subject(id),
    queryFn: () => institutionAcademicApi.getSubject(id),
    enabled: enabled && Number.isFinite(id),
  });
}
