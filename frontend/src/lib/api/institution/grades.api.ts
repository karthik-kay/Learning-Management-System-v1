import { djangoService, type QueryParams } from "@/services/djangoService";
import { ComputeSubjectResultPayload } from "@/types/institution";

export const institutionGradesApi = {
  getExams: (params?: QueryParams) => djangoService.getExams(params),
  getExam: (id: number) => djangoService.getExam(id),
  createExam: (data: unknown) => djangoService.createExam(data),
  updateExam: ({ id, data }: { id: number; data: unknown }) =>
    djangoService.updateExam(id, data),
  publishExam: (payload: number | { id: number; data?: unknown }) =>
    typeof payload === "number"
      ? djangoService.publishExam(payload)
      : djangoService.publishExam(payload.id, payload.data),
  getExamSubjects: (examId: number, params?: QueryParams) =>
    djangoService.getExamSubjects(examId, params),

  getEvaluationComponents: (params?: QueryParams) =>
    djangoService.getEvaluationComponents(params),
  getEvaluationComponent: (id: number) => djangoService.getEvaluationComponent(id),
  createEvaluationComponent: (data: unknown) =>
    djangoService.createEvaluationComponent(data),
  updateEvaluationComponent: ({ id, data }: { id: number; data: unknown }) =>
    djangoService.updateEvaluationComponent(id, data),

  getStudentScores: (params?: QueryParams) => djangoService.getStudentScores(params),
  uploadBulkScores: (data: unknown) => djangoService.uploadBulkScores(data),

  getResults: (params?: QueryParams) => djangoService.getResults(params),
  publishResults: (payload: number | { examId: number; data?: unknown }) =>
    typeof payload === "number"
      ? djangoService.publishResults(payload)
      : djangoService.publishResults(payload.examId, payload.data),
  getSubjectResults: (params?: QueryParams) => djangoService.getSubjectResults(params),
  computeSubjectResult: (data: ComputeSubjectResultPayload) =>
    djangoService.computeSubjectResult(data),
  getStudentCgpa: (studentId: number) => djangoService.getStudentCGPA(studentId),

  getAssignments: (params?: QueryParams) => djangoService.getAssignments(params),
  getAssignment: (id: number) => djangoService.getAssignment(id),
  createAssignment: (data: unknown) => djangoService.createAssignment(data),
  updateAssignment: ({ id, data }: { id: number; data: unknown }) =>
    djangoService.updateAssignment(id, data),
  getSubmissions: (params?: QueryParams) => djangoService.getSubmissions(params),
  markSubmission: ({
    submissionId,
    data,
  }: {
    submissionId: number;
    data: unknown;
  }) => djangoService.markSubmission(submissionId, data),
};
