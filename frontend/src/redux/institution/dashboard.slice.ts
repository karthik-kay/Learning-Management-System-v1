// store/institution/dashboard.slice.ts
import { createSlice, createAsyncThunk, isRejected } from "@reduxjs/toolkit";
import { djangoService } from "@/services/djangoService";
import {
  InstitutionDashboardData,
  HODDashboardData,
} from "@/types/institution/dashboard";

type RequestStatus = "idle" | "loading" | "succeeded" | "failed";

interface DashboardState {
  admin: {
    data: InstitutionDashboardData | null;
    status: RequestStatus;
  };
  hod: {
    data: HODDashboardData | null;
    status: RequestStatus;
  };
  error: string | null;
}

const initialState: DashboardState = {
  admin: { data: null, status: "idle" },
  hod: { data: null, status: "idle" },
  error: null,
};

export const fetchAdminDashboard = createAsyncThunk<InstitutionDashboardData>(
  "dashboard/fetchAdmin",
  async () => {
    return await djangoService.getAdminDashboard();
  },
);

export const fetchHodDashboard = createAsyncThunk<HODDashboardData>(
  "dashboard/fetchHod",
  async () => {
    return await djangoService.getHodDashboard();
  },
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    clearDashboardError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Admin Dashboard
      .addCase(fetchAdminDashboard.pending, (state) => {
        state.admin.status = "loading";
        state.error = null;
      })
      .addCase(fetchAdminDashboard.fulfilled, (state, action) => {
        state.admin.status = "succeeded";
        state.admin.data = action.payload;
      })
      // HOD Dashboard
      .addCase(fetchHodDashboard.pending, (state) => {
        state.hod.status = "loading";
        state.error = null;
      })
      .addCase(fetchHodDashboard.fulfilled, (state, action) => {
        state.hod.status = "succeeded";
        state.hod.data = action.payload;
      })
      // Global Error Catcher
      .addMatcher(isRejected, (state, action) => {
        if (action.type.includes("fetchAdmin")) state.admin.status = "failed";
        if (action.type.includes("fetchHod")) state.hod.status = "failed";

        state.error =
          action.error?.message === "AUTH_SESSION_EXPIRED"
            ? "AUTH_SESSION_EXPIRED"
            : action.error?.message || "FETCH_ERROR";
      });
  },
});

export const { clearDashboardError } = dashboardSlice.actions;
export default dashboardSlice.reducer;
