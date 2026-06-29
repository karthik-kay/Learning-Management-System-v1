import { useMutation, useQueryClient } from "@tanstack/react-query";

import { studentTicketsApi } from "@/lib/api/student";
import { queryKeys } from "@/lib/query/queryKeys";

export function useCreateTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: studentTicketsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.student.tickets() });
    },
  });
}
