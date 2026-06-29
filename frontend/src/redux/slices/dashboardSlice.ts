import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { isRejected } from "@reduxjs/toolkit";
import { djangoService } from "@/services/djangoService";
import { DashboardData } from "@/types";

/* ---------- TYPES ---------- */

export interface MonthlyStats {
  learning_hours: number;
  modules_completed: number;
  assessments_passed: number;
}

interface DashboardState {
  base: DashboardData | null;
  monthly: MonthlyStats | null;

  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

export const fetchDashboard = createAsyncThunk(
  "dashboard/fetchDashboard",
  async () => {
    return await djangoService.getDashboard({ include_stats: "1" });
  }
);

const initialState: DashboardState = {
  base: null,
  monthly: null,
  status: "idle",
  error: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    resetDashboard: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.base = action.payload;
        state.monthly = action.payload.monthly_stats ?? null;
        state.error = null;
      })

      .addMatcher(isRejected, (state, action) => {
        state.status = "failed";
        if (action.error?.message === "AUTH_SESSION_EXPIRED") {
          state.error = "AUTH_SESSION_EXPIRED";
        } else {
          state.error = action.error?.message || "FETCH_ERROR";
        }
      });
  },
});

export const { resetDashboard } = dashboardSlice.actions;
export default dashboardSlice.reducer;
