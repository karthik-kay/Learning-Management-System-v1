import { djangoService, type QueryParams } from "@/services/djangoService";

export const institutionAuditApi = {
  getLogs: (params?: QueryParams) => djangoService.getInstitutionAuditLogs(params),
};
