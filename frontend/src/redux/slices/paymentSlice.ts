import { createSlice } from "@reduxjs/toolkit";
import {
  createOrderThunk,
  verifyPaymentThunk,
  fetchPaymentHistoryThunk,
} from "../thunks/paymentThunks";
import { CreateOrderResponse } from "@/types";

type PaymentState = {
  order: CreateOrderResponse | null;
  loading: boolean;
  error: string | null;
  history: any[];
};

const initialState: PaymentState = {
  order: null,
  loading: false,
  error: null,
  history: [],
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    clearPaymentState: (state) => {
      state.order = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // CREATE ORDER
      .addCase(createOrderThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrderThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(createOrderThunk.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })

      // VERIFY PAYMENT
      .addCase(verifyPaymentThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyPaymentThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(verifyPaymentThunk.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })

      // PAYMENT HISTORY
      .addCase(fetchPaymentHistoryThunk.fulfilled, (state, action) => {
        state.history = action.payload.orders;
      });
  },
});

export const { clearPaymentState } = paymentSlice.actions;
export default paymentSlice.reducer;
