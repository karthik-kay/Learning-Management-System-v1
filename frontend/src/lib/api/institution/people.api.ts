import { djangoService, type QueryParams } from "@/services/djangoService";

export const institutionPeopleApi = {
  getStudents: (params?: QueryParams) =>
    djangoService.getInstitutionStudents(params),
  getStudent: (id: number) => djangoService.getInstitutionStudent(id),
  createStudent: (data: unknown) => djangoService.createInstitutionStudent(data),
  updateStudent: ({ id, data }: { id: number; data: unknown }) =>
    djangoService.updateInstitutionStudent(id, data),
  suspendStudent: (payload: number | { id: number; data?: unknown }) =>
    typeof payload === "number"
      ? djangoService.suspendStudent(payload)
      : djangoService.suspendStudent(payload.id, payload.data),
  promoteStudent: (payload: number | { id: number; data?: unknown }) =>
    typeof payload === "number"
      ? djangoService.promoteStudent(payload)
      : djangoService.promoteStudent(payload.id, payload.data),
  bulkImportStudents: (file: File) => djangoService.bulkImportStudents(file),

  getFaculty: (params?: QueryParams) =>
    djangoService.getInstitutionFaculty(params),
  getFacultyDetail: (id: number) => djangoService.getInstitutionFacultyDetail(id),
  createFaculty: (data: unknown) => djangoService.createInstitutionFaculty(data),
  updateFaculty: ({ id, data }: { id: number; data: unknown }) =>
    djangoService.updateInstitutionFaculty(id, data),
  suspendFaculty: (payload: number | { id: number; data?: unknown }) =>
    typeof payload === "number"
      ? djangoService.suspendFaculty(payload)
      : djangoService.suspendFaculty(payload.id, payload.data),
  reactivateFaculty: (payload: number | { id: number; data?: unknown }) =>
    typeof payload === "number"
      ? djangoService.reactivateFaculty(payload)
      : djangoService.reactivateFaculty(payload.id, payload.data),
  offboardFaculty: (payload: number | { id: number; data?: unknown }) =>
    typeof payload === "number"
      ? djangoService.offboardFaculty(payload)
      : djangoService.offboardFaculty(payload.id, payload.data),
  makeHod: ({
    facultyId,
    departmentId,
  }: {
    facultyId: number;
    departmentId: number;
  }) => djangoService.makeHod(facultyId, departmentId),
};
