import { createSlice, createAsyncThunk, isRejected } from "@reduxjs/toolkit";

import { djangoService } from "@/services/djangoService";

import { PaginatedResponse } from "@/types/institution/common";

import {
  TimeSlot,
  FacultySubjectAssignment,
  TimetableEntry,
  TimetableConflict,
} from "@/types/institution/timetable";

type RequestStatus = "idle" | "loading" | "succeeded" | "failed";

interface TimetableState {
  slots: {
    list: TimeSlot[];

    status: RequestStatus;
  };

  assignments: {
    list: FacultySubjectAssignment[];

    status: RequestStatus;
  };

  entries: {
    list: TimetableEntry[];

    status: RequestStatus;
  };

  conflicts: {
    list: TimetableConflict[];

    status: RequestStatus;
  };

  error: string | null;
}

const initialState: TimetableState = {
  slots: {
    list: [],

    status: "idle",
  },

  assignments: {
    list: [],

    status: "idle",
  },

  entries: {
    list: [],

    status: "idle",
  },

  conflicts: {
    list: [],

    status: "idle",
  },

  error: null,
};

export const fetchTimeSlots = createAsyncThunk<PaginatedResponse<TimeSlot>>(
  "timetable/slots",

  async () => {
    return await djangoService.getTimeSlots();
  },
);

export const fetchFacultyAssignments = createAsyncThunk<
  PaginatedResponse<FacultySubjectAssignment>
>(
  "timetable/assignments",

  async () => {
    return await djangoService.getFacultyAssignments();
  },
);

export const fetchTimetableEntries = createAsyncThunk<
  PaginatedResponse<TimetableEntry>
>(
  "timetable/entries",

  async () => {
    return await djangoService.getTimetableEntries();
  },
);

export const fetchConflicts = createAsyncThunk<TimetableConflict[]>(
  "timetable/conflicts",

  async () => {
    return await djangoService.getConflicts();
  },
);

const timetableSlice = createSlice({
  name: "timetable",

  initialState,

  reducers: {
    clearTimetableError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(
        fetchTimeSlots.pending,

        (state) => {
          state.slots.status = "loading";
        },
      )

      .addCase(
        fetchTimeSlots.fulfilled,

        (state, action) => {
          state.slots.status = "succeeded";

          state.slots.list = action.payload.results;
        },
      )

      .addCase(
        fetchFacultyAssignments.pending,

        (state) => {
          state.assignments.status = "loading";
        },
      )

      .addCase(
        fetchFacultyAssignments.fulfilled,

        (state, action) => {
          state.assignments.status = "succeeded";

          state.assignments.list = action.payload.results;
        },
      )

      .addCase(
        fetchTimetableEntries.pending,

        (state) => {
          state.entries.status = "loading";
        },
      )

      .addCase(
        fetchTimetableEntries.fulfilled,

        (state, action) => {
          state.entries.status = "succeeded";

          state.entries.list = action.payload.results;
        },
      )

      .addCase(
        fetchConflicts.pending,

        (state) => {
          state.conflicts.status = "loading";
        },
      )

      .addCase(
        fetchConflicts.fulfilled,

        (state, action) => {
          state.conflicts.status = "succeeded";

          state.conflicts.list = action.payload;
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

export const { clearTimetableError } = timetableSlice.actions;

export default timetableSlice.reducer;
