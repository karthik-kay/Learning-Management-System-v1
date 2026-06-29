import { LeaveDecisionPayload } from "@/types/institution";
import { djangoService, type QueryParams } from "@/services/djangoService";

export const institutionAttendanceApi = {
  getSessions: (params?: QueryParams) => djangoService.getAttendanceSessions(params),
  getSession: (id: number) => djangoService.getAttendanceSession(id),
  createSession: (data: unknown) => djangoService.createAttendanceSession(data),
  updateSession: ({ id, data }: { id: number; data: unknown }) =>
    djangoService.updateAttendanceSession(id, data),

  getRecords: (params?: QueryParams) => djangoService.getAttendanceRecords(params),
  markBulk: (data: unknown) => djangoService.markBulkAttendance(data),
  getShortages: (params?: QueryParams) => djangoService.getAttendanceShortage(params),
  unlockSession: (payload: number | { sessionId: number; data?: unknown }) =>
    typeof payload === "number"
      ? djangoService.unlockAttendance(payload)
      : djangoService.unlockAttendance(payload.sessionId, payload.data),
  sendBulkShortageAlert: (data?: unknown) =>
    djangoService.sendBulkShortageAlert(data),

  getLeaveApplications: (params?: QueryParams) =>
    djangoService.getLeaveApplications(params),
  applyLeave: (data: unknown) => djangoService.applyLeave(data),
  decideLeave: ({
    leaveId,
    data,
  }: {
    leaveId: number;
    data: LeaveDecisionPayload;
  }) => djangoService.approveLeave(leaveId, data),
  rejectLeave: ({
    leaveId,
    reviewNote,
  }: {
    leaveId: number;
    reviewNote?: string;
  }) => djangoService.rejectLeave(leaveId, reviewNote),
};
