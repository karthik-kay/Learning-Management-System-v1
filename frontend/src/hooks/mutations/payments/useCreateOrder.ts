import { useMutation } from "@tanstack/react-query";

import { paymentsApi } from "@/lib/api/payments";

export function useCreateOrder() {
  return useMutation({
    mutationFn: paymentsApi.createOrder,
  });
}
