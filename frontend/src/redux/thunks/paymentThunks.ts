import { createAsyncThunk } from "@reduxjs/toolkit";
import { djangoService } from "@/services/djangoService";
import {
  CreateOrderPayload,
  CreateOrderResponse,
  VerifyPaymentPayload,
  PaymentHistoryResponse,
} from "@/types";

export const createOrderThunk = createAsyncThunk<
  CreateOrderResponse,
  CreateOrderPayload,
  { rejectValue: string }
>("payment/createOrder", async (payload, { rejectWithValue }) => {
  try {
    return await djangoService.createOrder(payload);
  } catch (err: any) {
    return rejectWithValue(err.message || "Create order failed");
  }
});

export const verifyPaymentThunk = createAsyncThunk<
  any,
  VerifyPaymentPayload,
  { rejectValue: string }
>("payment/verifyPayment", async (payload, { rejectWithValue }) => {
  try {
    return await djangoService.verifyPayment(payload);
  } catch (err: any) {
    return rejectWithValue(err.message || "Verify failed");
  }
});

export const fetchPaymentHistoryThunk = createAsyncThunk<
  PaymentHistoryResponse,
  void,
  { rejectValue: string }
>("payment/history", async (_, { rejectWithValue }) => {
  try {
    return await djangoService.getPaymentHistory();
  } catch (err: any) {
    return rejectWithValue(err.message || "Fetch history failed");
  }
});
