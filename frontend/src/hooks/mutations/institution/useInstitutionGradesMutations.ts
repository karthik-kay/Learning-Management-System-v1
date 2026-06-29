import { useMutation, useQueryClient } from "@tanstack/react-query";

import { institutionGradesApi } from "@/lib/api/institution";

export function useCreateInstitutionExam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: institutionGradesApi.createExam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["institution", "exams"] });
    },
  });
}

export function usePublishInstitutionExam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: institutionGradesApi.publishExam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["institution", "exams"] });
    },
  });
}

export function useCreateInstitutionEvaluationComponent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: institutionGradesApi.createEvaluationComponent,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["institution", "evaluation-components"],
      });
    },
  });
}

export function useCreateInstitutionAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: institutionGradesApi.createAssignment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["institution", "assignments"] });
    },
  });
}

export function useUploadInstitutionBulkScores() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: institutionGradesApi.uploadBulkScores,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["institution", "component-scores"],
      });
      queryClient.invalidateQueries({ queryKey: ["institution", "reports"] });
    },
  });
}

export function usePublishInstitutionResults() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: institutionGradesApi.publishResults,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["institution", "exam-results"],
      });
      queryClient.invalidateQueries({
        queryKey: ["institution", "subject-results"],
      });
    },
  });
}

export function useComputeInstitutionSubjectResult() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: institutionGradesApi.computeSubjectResult,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["institution", "subject-results"],
      });
    },
  });
}

export function useMarkInstitutionSubmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: institutionGradesApi.markSubmission,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["institution", "submissions"],
      });
    },
  });
}
