import { createSlice, createAsyncThunk, isRejected } from "@reduxjs/toolkit";

import { djangoService } from "@/services/djangoService";

import { PaginatedResponse } from "@/types/institution/common";

import {
  AttendanceSession,
  AttendanceRecord,
  AttendanceShortage,
} from "@/types/institution/attendance";

type RequestStatus = "idle" | "loading" | "succeeded" | "failed";

interface AttendanceState {
  sessions: {
    list: AttendanceSession[];

    status: RequestStatus;
  };

  records: {
    list: AttendanceRecord[];

    status: RequestStatus;
  };

  shortages: {
    list: AttendanceShortage[];

    status: RequestStatus;
  };

  error: string | null;
}

const initialState: AttendanceState = {
  sessions: {
    list: [],

    status: "idle",
  },

  records: {
    list: [],

    status: "idle",
  },

  shortages: {
    list: [],

    status: "idle",
  },

  error: null,
};

export const fetchAttendanceSessions = createAsyncThunk<
  PaginatedResponse<AttendanceSession>
>(
  "attendance/sessions",

  async () => {
    return await djangoService.getAttendanceSessions();
  },
);

export const fetchAttendanceRecords = createAsyncThunk<
  PaginatedResponse<AttendanceRecord>
>(
  "attendance/records",

  async () => {
    return await djangoService.getAttendanceRecords();
  },
);

export const fetchAttendanceShortage = createAsyncThunk<AttendanceShortage[]>(
  "attendance/shortage",

  async () => {
    return await djangoService.getAttendanceShortage();
  },
);

const attendanceSlice = createSlice({
  name: "attendance",

  initialState,

  reducers: {
    clearAttendanceError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(
        fetchAttendanceSessions.pending,

        (state) => {
          state.sessions.status = "loading";
        },
      )

      .addCase(
        fetchAttendanceSessions.fulfilled,

        (state, action) => {
          state.sessions.status = "succeeded";

          state.sessions.list = action.payload.results;
        },
      )

      .addCase(
        fetchAttendanceRecords.pending,

        (state) => {
          state.records.status = "loading";
        },
      )

      .addCase(
        fetchAttendanceRecords.fulfilled,

        (state, action) => {
          state.records.status = "succeeded";

          state.records.list = action.payload.results;
        },
      )

      .addCase(
        fetchAttendanceShortage.pending,

        (state) => {
          state.shortages.status = "loading";
        },
      )

      .addCase(
        fetchAttendanceShortage.fulfilled,

        (state, action) => {
          state.shortages.status = "succeeded";

          state.shortages.list = action.payload;
        },
      )

      .addMatcher(
        isRejected,

        (state, action) => {
          state.error = action.error?.message || "FETCH_ERROR";
        },
      );
  },
});

export const { clearAttendanceError } = attendanceSlice.actions;

export default attendanceSlice.reducer;
