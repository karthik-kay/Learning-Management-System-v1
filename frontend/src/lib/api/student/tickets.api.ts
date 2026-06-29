import { djangoService } from "@/services/djangoService";

export const studentTicketsApi = {
  list: () => djangoService.getTickets(),
  detail: (ticketId: string) => djangoService.getTicket(ticketId),
  create: (data: Parameters<typeof djangoService.createTicket>[0]) =>
    djangoService.createTicket(data),
  updateStatus: (
    ticketId: string,
    data: Parameters<typeof djangoService.updateTicketStatus>[1],
  ) => djangoService.updateTicketStatus(ticketId, data),
  messages: (ticketId: string) => djangoService.getTicketMessages(ticketId),
  sendMessage: (data: Parameters<typeof djangoService.sendMessage>[0]) =>
    djangoService.sendMessage(data),
};
