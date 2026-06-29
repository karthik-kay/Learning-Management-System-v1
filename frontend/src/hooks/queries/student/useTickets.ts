import { useQuery } from "@tanstack/react-query";

import { studentTicketsApi } from "@/lib/api/student";
import { queryKeys } from "@/lib/query/queryKeys";

export function useTickets() {
  return useQuery({
    queryKey: queryKeys.student.tickets(),
    queryFn: studentTicketsApi.list,
  });
}

export function useTicket(ticketId: string) {
  return useQuery({
    queryKey: queryKeys.student.ticket(ticketId),
    queryFn: () => studentTicketsApi.detail(ticketId),
    enabled: Boolean(ticketId),
  });
}

export function useTicketMessages(ticketId: string) {
  return useQuery({
    queryKey: queryKeys.student.ticketMessages(ticketId),
    queryFn: () => studentTicketsApi.messages(ticketId),
    enabled: Boolean(ticketId),
  });
}
