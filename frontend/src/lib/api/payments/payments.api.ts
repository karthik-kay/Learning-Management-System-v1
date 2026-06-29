import { djangoService } from "@/services/djangoService";

export const paymentsApi = {
  createOrder: (data: Parameters<typeof djangoService.createOrder>[0]) =>
    djangoService.createOrder(data),
  verify: (data: Parameters<typeof djangoService.verifyPayment>[0]) =>
    djangoService.verifyPayment(data),
  history: () => djangoService.getPaymentHistory(),
};
