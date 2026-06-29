import { djangoService, type QueryParams } from "@/services/djangoService";

export const institutionReportsApi = {
  getAttendance: (params?: QueryParams) =>
    djangoService.getAttendanceReport(params),
  getSubjectAttendance: (studentId: number, params?: QueryParams) =>
    djangoService.getSubjectAttendanceReport(studentId, params),
  getPerformance: (params?: QueryParams) =>
    djangoService.getPerformanceReport(params),
  getFacultyActivity: (params?: QueryParams) =>
    djangoService.getFacultyActivityReport(params),
  getBatchPerformance: (params?: QueryParams) =>
    djangoService.getBatchPerformanceReport(params),
  getStudentProgress: (studentId: number, params?: QueryParams) =>
    djangoService.getStudentProgressReport(studentId, params),
  getAtRiskStudents: (params?: QueryParams) =>
    djangoService.getAtRiskStudents(params),
};
