import { createAsyncThunk } from "@reduxjs/toolkit";
import { djangoService } from "@/services/djangoService";
import {
  CreateTicketData,
  SendMessageData,
  UpdateTicketStatusData,
} from "@/types";

export const fetchTickets = createAsyncThunk(
  "tickets/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await djangoService.getTickets();
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);

export const fetchTicket = createAsyncThunk(
  "tickets/fetchOne",
  async (ticketId: string, { rejectWithValue }) => {
    try {
      return await djangoService.getTicket(ticketId);
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);

export const createTicket = createAsyncThunk(
  "tickets/create",
  async (data: CreateTicketData, { rejectWithValue }) => {
    try {
      return await djangoService.createTicket(data);
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);

export const updateTicketStatus = createAsyncThunk(
  "tickets/updateStatus",
  async (
    { ticketId, data }: { ticketId: string; data: UpdateTicketStatusData },
    { rejectWithValue },
  ) => {
    try {
      return await djangoService.updateTicketStatus(ticketId, data);
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);

export const fetchTicketMessages = createAsyncThunk(
  "tickets/fetchMessages",
  async (ticketId: string, { rejectWithValue }) => {
    try {
      return await djangoService.getTicketMessages(ticketId);
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);

export const sendMessage = createAsyncThunk(
  "tickets/sendMessage",
  async (data: SendMessageData, { rejectWithValue }) => {
    try {
      return await djangoService.sendMessage(data);
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);
