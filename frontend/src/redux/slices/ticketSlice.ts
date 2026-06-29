import { createSlice } from "@reduxjs/toolkit";
import { Ticket, TicketMessage } from "@/types";
import {
  fetchTickets,
  fetchTicket,
  createTicket,
  updateTicketStatus,
  fetchTicketMessages,
  sendMessage,
} from "@/redux/thunks/ticketThunks";

interface TicketState {
  tickets: Ticket[];
  selectedTicket: Ticket | null;
  messages: TicketMessage[];
  loading: boolean;
  messageLoading: boolean;
  error: string | null;
}

const initialState: TicketState = {
  tickets: [],
  selectedTicket: null,
  messages: [],
  loading: false,
  messageLoading: false,
  error: null,
};

const ticketSlice = createSlice({
  name: "tickets",
  initialState,
  reducers: {
    clearSelectedTicket(state) {
      state.selectedTicket = null;
      state.messages = [];
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.tickets = action.payload;
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchTicket.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTicket.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedTicket = action.payload;
      })
      .addCase(fetchTicket.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(createTicket.pending, (state) => {
        state.loading = true;
      })
      .addCase(createTicket.fulfilled, (state, action) => {
        state.loading = false;
        state.tickets.unshift(action.payload);
      })
      .addCase(createTicket.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(updateTicketStatus.fulfilled, (state, action) => {
        const idx = state.tickets.findIndex((t) => t.id === action.payload.id);
        if (idx !== -1) state.tickets[idx] = action.payload;
        if (state.selectedTicket?.id === action.payload.id)
          state.selectedTicket = action.payload;
      })

      .addCase(fetchTicketMessages.pending, (state) => {
        state.messageLoading = true;
      })
      .addCase(fetchTicketMessages.fulfilled, (state, action) => {
        state.messageLoading = false;
        state.messages = action.payload;
      })
      .addCase(fetchTicketMessages.rejected, (state, action) => {
        state.messageLoading = false;
        state.error = action.payload as string;
      })

      .addCase(sendMessage.fulfilled, (state, action) => {
        if (!action.payload.parent) {
          state.messages.push(action.payload);
        }
      });
  },
});

export const { clearSelectedTicket, clearError } = ticketSlice.actions;
export default ticketSlice.reducer;
