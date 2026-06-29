import { useQuery } from "@tanstack/react-query";

import { paymentsApi } from "@/lib/api/payments";
import { queryKeys } from "@/lib/query/queryKeys";

export function usePaymentHistory() {
  return useQuery({
    queryKey: queryKeys.payments.history(),
    queryFn: paymentsApi.history,
  });
}
