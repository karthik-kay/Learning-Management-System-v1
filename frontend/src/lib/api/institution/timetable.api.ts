import { djangoService, type QueryParams } from "@/services/djangoService";

export const institutionTimetableApi = {
  getTimeSlots: (params?: QueryParams) => djangoService.getTimeSlots(params),
  getTimeSlot: (id: number) => djangoService.getTimeSlot(id),
  createTimeSlot: (data: unknown) => djangoService.createTimeSlot(data),
  updateTimeSlot: ({ id, data }: { id: number; data: unknown }) =>
    djangoService.updateTimeSlot(id, data),

  getTeachingAssignments: (params?: QueryParams) =>
    djangoService.getFacultyAssignments(params),
  getTeachingAssignment: (id: number) => djangoService.getFacultyAssignment(id),
  createTeachingAssignment: (data: unknown) =>
    djangoService.createFacultyAssignment(data),
  updateTeachingAssignment: ({ id, data }: { id: number; data: unknown }) =>
    djangoService.updateFacultyAssignment(id, data),

  getEntries: (params?: QueryParams) => djangoService.getTimetableEntries(params),
  getEntry: (id: number) => djangoService.getTimetableEntry(id),
  createEntry: (data: unknown) => djangoService.createTimetableEntry(data),
  updateEntry: ({ id, data }: { id: number; data: unknown }) =>
    djangoService.updateTimetableEntry(id, data),

  publish: ({ sectionId, data }: { sectionId: number; data?: unknown }) =>
    djangoService.publishTimetable(sectionId, data),
  getConflicts: (params?: QueryParams) => djangoService.getConflicts(params),
  addSubstitute: (data: unknown) => djangoService.addSubstitute(data),
};
