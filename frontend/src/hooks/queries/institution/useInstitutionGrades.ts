import { useQuery } from "@tanstack/react-query";

import { institutionGradesApi } from "@/lib/api/institution";
import { queryKeys } from "@/lib/query/queryKeys";

export function useInstitutionExams() {
  return useQuery({
    queryKey: queryKeys.institution.exams(),
    queryFn: () => institutionGradesApi.getExams(),
  });
}

export function useInstitutionExam(id: number, enabled = true) {
  return useQuery({
    queryKey: queryKeys.institution.exam(id),
    queryFn: () => institutionGradesApi.getExam(id),
    enabled: enabled && Number.isFinite(id),
  });
}

export function useInstitutionExamSubjects(examId: number, enabled = true) {
  return useQuery({
    queryKey: queryKeys.institution.examSubjects(examId),
    queryFn: () => institutionGradesApi.getExamSubjects(examId),
    enabled: enabled && Number.isFinite(examId),
  });
}

export function useInstitutionEvaluationComponents() {
  return useQuery({
    queryKey: queryKeys.institution.evaluationComponents(),
    queryFn: () => institutionGradesApi.getEvaluationComponents(),
  });
}

export function useInstitutionComponentScores() {
  return useQuery({
    queryKey: queryKeys.institution.componentScores(),
    queryFn: () => institutionGradesApi.getStudentScores(),
  });
}

export function useInstitutionExamResults() {
  return useQuery({
    queryKey: queryKeys.institution.examResults(),
    queryFn: () => institutionGradesApi.getResults(),
  });
}

export function useInstitutionSubjectResults() {
  return useQuery({
    queryKey: queryKeys.institution.subjectResults(),
    queryFn: () => institutionGradesApi.getSubjectResults(),
  });
}

export function useInstitutionAssignments() {
  return useQuery({
    queryKey: queryKeys.institution.assignments(),
    queryFn: () => institutionGradesApi.getAssignments(),
  });
}

export function useInstitutionSubmissions() {
  return useQuery({
    queryKey: queryKeys.institution.submissions(),
    queryFn: institutionGradesApi.getSubmissions,
  });
}
