import { useMutation, useQueryClient } from "@tanstack/react-query";

import { paymentsApi } from "@/lib/api/payments";
import { queryKeys } from "@/lib/query/queryKeys";

export function useVerifyPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: paymentsApi.verify,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.payments.history(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.student.enrollments(),
      });
    },
  });
}
