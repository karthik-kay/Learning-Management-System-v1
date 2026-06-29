import { useMutation, useQueryClient } from "@tanstack/react-query";

import { institutionAcademicApi } from "@/lib/api/institution";

function useInvalidateInstitutionStructure() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: ["institution", "departments"] });
    queryClient.invalidateQueries({ queryKey: ["institution", "programs"] });
    queryClient.invalidateQueries({ queryKey: ["institution", "batches"] });
    queryClient.invalidateQueries({ queryKey: ["institution", "sections"] });
    queryClient.invalidateQueries({ queryKey: ["institution", "subjects"] });
  };
}

export function useCreateInstitutionDepartment() {
  const invalidate = useInvalidateInstitutionStructure();

  return useMutation({
    mutationFn: institutionAcademicApi.createDepartment,
    onSuccess: invalidate,
  });
}

export function useUpdateInstitutionDepartment() {
  const invalidate = useInvalidateInstitutionStructure();

  return useMutation({
    mutationFn: institutionAcademicApi.updateDepartment,
    onSuccess: invalidate,
  });
}

export function useCreateInstitutionProgram() {
  const invalidate = useInvalidateInstitutionStructure();

  return useMutation({
    mutationFn: institutionAcademicApi.createProgram,
    onSuccess: invalidate,
  });
}

export function useUpdateInstitutionProgram() {
  const invalidate = useInvalidateInstitutionStructure();

  return useMutation({
    mutationFn: institutionAcademicApi.updateProgram,
    onSuccess: invalidate,
  });
}

export function useCreateInstitutionBatch() {
  const invalidate = useInvalidateInstitutionStructure();

  return useMutation({
    mutationFn: institutionAcademicApi.createBatch,
    onSuccess: invalidate,
  });
}

export function useUpdateInstitutionBatch() {
  const invalidate = useInvalidateInstitutionStructure();

  return useMutation({
    mutationFn: institutionAcademicApi.updateBatch,
    onSuccess: invalidate,
  });
}

export function useCreateInstitutionSection() {
  const invalidate = useInvalidateInstitutionStructure();

  return useMutation({
    mutationFn: institutionAcademicApi.createSection,
    onSuccess: invalidate,
  });
}

export function useUpdateInstitutionSection() {
  const invalidate = useInvalidateInstitutionStructure();

  return useMutation({
    mutationFn: institutionAcademicApi.updateSection,
    onSuccess: invalidate,
  });
}

export function useCreateInstitutionSubject() {
  const invalidate = useInvalidateInstitutionStructure();

  return useMutation({
    mutationFn: institutionAcademicApi.createSubject,
    onSuccess: invalidate,
  });
}

export function useUpdateInstitutionSubject() {
  const invalidate = useInvalidateInstitutionStructure();

  return useMutation({
    mutationFn: institutionAcademicApi.updateSubject,
    onSuccess: invalidate,
  });
}
