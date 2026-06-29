import { djangoService } from "@/services/djangoService";

export const studentDashboardApi = {
  get: (params?: Record<string, string>) => djangoService.getDashboard(params),
};
