import { djangoService } from "@/services/djangoService";

export const institutionDashboardApi = {
  getAdmin: () => djangoService.getAdminDashboard(),
  getHod: () => djangoService.getHodDashboard(),
};
