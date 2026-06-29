import { useMutation, useQueryClient } from "@tanstack/react-query";

import { studentTicketsApi } from "@/lib/api/student";
import { queryKeys } from "@/lib/query/queryKeys";

export function useSendTicketMessage(ticketId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: studentTicketsApi.sendMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.student.ticketMessages(ticketId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.student.ticket(ticketId),
      });
    },
  });
}
