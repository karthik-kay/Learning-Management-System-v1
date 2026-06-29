import { djangoService, type QueryParams } from "@/services/djangoService";

export const institutionAcademicApi = {
  getDegrees: (params?: QueryParams) => djangoService.getDegrees(params),
  getDegree: (id: number) => djangoService.getDegree(id),
  createDegree: (data: unknown) => djangoService.createDegree(data),
  updateDegree: ({ id, data }: { id: number; data: unknown }) =>
    djangoService.updateDegree(id, data),

  getDepartments: (params?: QueryParams) => djangoService.getDepartments(params),
  getDepartment: (id: number) => djangoService.getDepartment(id),
  createDepartment: (data: unknown) => djangoService.createDepartment(data),
  updateDepartment: ({ id, data }: { id: number; data: unknown }) =>
    djangoService.updateDepartment(id, data),

  getPrograms: (params?: QueryParams) => djangoService.getPrograms(params),
  getProgram: (id: number) => djangoService.getProgram(id),
  createProgram: (data: unknown) => djangoService.createProgram(data),
  updateProgram: ({ id, data }: { id: number; data: unknown }) =>
    djangoService.updateProgram(id, data),

  getBatches: (params?: QueryParams) => djangoService.getBatches(params),
  getBatch: (id: number) => djangoService.getBatch(id),
  createBatch: (data: unknown) => djangoService.createBatch(data),
  updateBatch: ({ id, data }: { id: number; data: unknown }) =>
    djangoService.updateBatch(id, data),

  getSections: (params?: QueryParams) => djangoService.getSections(params),
  getSection: (id: number) => djangoService.getSection(id),
  createSection: (data: unknown) => djangoService.createSection(data),
  updateSection: ({ id, data }: { id: number; data: unknown }) =>
    djangoService.updateSection(id, data),

  getSubjects: (params?: QueryParams) => djangoService.getSubjects(params),
  getSubject: (id: number) => djangoService.getSubject(id),
  createSubject: (data: unknown) => djangoService.createSubject(data),
  updateSubject: ({ id, data }: { id: number; data: unknown }) =>
    djangoService.updateSubject(id, data),
};
