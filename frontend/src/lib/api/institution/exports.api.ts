import { InstitutionExportCreatePayload } from "@/types/institution";
import { djangoService, type QueryParams } from "@/services/djangoService";

export const institutionExportsApi = {
  getJobs: (params?: QueryParams) =>
    djangoService.getInstitutionExports(params),
  getJob: (id: number) => djangoService.getInstitutionExport(id),
  createJob: (data: InstitutionExportCreatePayload) =>
    djangoService.createInstitutionExport(data),
};
