import { useMutation, useQueryClient } from "@tanstack/react-query";

import { institutionPeopleApi } from "@/lib/api/institution";
import { queryKeys } from "@/lib/query/queryKeys";

export function useCreateInstitutionStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: institutionPeopleApi.createStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["institution", "students"] });
      queryClient.invalidateQueries({
        queryKey: queryKeys.institution.dashboard("admin"),
      });
    },
  });
}

export function useUpdateInstitutionStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: institutionPeopleApi.updateStudent,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["institution", "students"] });
      queryClient.invalidateQueries({
        queryKey: queryKeys.institution.student(variables.id),
      });
    },
  });
}

export function useSuspendInstitutionStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: institutionPeopleApi.suspendStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["institution", "students"] });
    },
  });
}

export function usePromoteInstitutionStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: institutionPeopleApi.promoteStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["institution", "students"] });
      queryClient.invalidateQueries({ queryKey: ["institution", "batches"] });
      queryClient.invalidateQueries({ queryKey: ["institution", "sections"] });
    },
  });
}

export function useBulkImportInstitutionStudents() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: institutionPeopleApi.bulkImportStudents,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["institution", "students"] });
      queryClient.invalidateQueries({
        queryKey: queryKeys.institution.dashboard("admin"),
      });
    },
  });
}

export function useCreateInstitutionFaculty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: institutionPeopleApi.createFaculty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["institution", "faculty"] });
      queryClient.invalidateQueries({
        queryKey: queryKeys.institution.dashboard("admin"),
      });
    },
  });
}

export function useUpdateInstitutionFaculty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: institutionPeopleApi.updateFaculty,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["institution", "faculty"] });
      queryClient.invalidateQueries({
        queryKey: queryKeys.institution.facultyDetail(variables.id),
      });
    },
  });
}

export function useSuspendInstitutionFaculty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: institutionPeopleApi.suspendFaculty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["institution", "faculty"] });
    },
  });
}

export function useReactivateInstitutionFaculty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: institutionPeopleApi.reactivateFaculty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["institution", "faculty"] });
    },
  });
}

export function useOffboardInstitutionFaculty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: institutionPeopleApi.offboardFaculty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["institution", "faculty"] });
    },
  });
}

export function useMakeInstitutionHod() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: institutionPeopleApi.makeHod,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["institution", "faculty"] });
      queryClient.invalidateQueries({
        queryKey: queryKeys.institution.departments(),
      });
    },
  });
}
