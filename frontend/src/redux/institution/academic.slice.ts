import { createSlice, createAsyncThunk, isRejected } from "@reduxjs/toolkit";

import { djangoService } from "@/services/djangoService";

import {
  Degree,
  Department,
  Program,
  AcademicBatch,
  Section,
  Subject,
} from "@/types/institution/academic";

import { PaginatedResponse } from "@/types/institution/common";

type RequestStatus = "idle" | "loading" | "succeeded" | "failed";

interface AcademicState {
  degrees: {
    list: Degree[];

    status: RequestStatus;
  };

  departments: {
    list: Department[];

    status: RequestStatus;
  };

  programs: {
    list: Program[];

    status: RequestStatus;
  };

  batches: {
    list: AcademicBatch[];

    status: RequestStatus;
  };

  sections: {
    list: Section[];

    status: RequestStatus;
  };

  subjects: {
    list: Subject[];

    status: RequestStatus;
  };

  error: string | null;
}

const initialState: AcademicState = {
  degrees: {
    list: [],
    status: "idle",
  },

  departments: {
    list: [],
    status: "idle",
  },

  programs: {
    list: [],
    status: "idle",
  },

  batches: {
    list: [],
    status: "idle",
  },

  sections: {
    list: [],
    status: "idle",
  },

  subjects: {
    list: [],
    status: "idle",
  },

  error: null,
};

export const fetchDegrees = createAsyncThunk<PaginatedResponse<Degree>>(
  "academic/degrees",

  async () => {
    return await djangoService.getDegrees();
  },
);

export const fetchDepartments = createAsyncThunk<PaginatedResponse<Department>>(
  "academic/departments",

  async () => {
    return await djangoService.getDepartments();
  },
);

export const fetchPrograms = createAsyncThunk<PaginatedResponse<Program>>(
  "academic/programs",

  async () => {
    return await djangoService.getPrograms();
  },
);

export const fetchBatches = createAsyncThunk<PaginatedResponse<AcademicBatch>>(
  "academic/batches",

  async () => {
    return await djangoService.getBatches();
  },
);

export const fetchSections = createAsyncThunk<PaginatedResponse<Section>>(
  "academic/sections",

  async () => {
    return await djangoService.getSections();
  },
);

export const fetchSubjects = createAsyncThunk<PaginatedResponse<Subject>>(
  "academic/subjects",

  async () => {
    return await djangoService.getSubjects();
  },
);

const academicSlice = createSlice({
  name: "academic",

  initialState,

  reducers: {
    clearAcademicError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(
        fetchDegrees.pending,

        (state) => {
          state.degrees.status = "loading";
        },
      )

      .addCase(
        fetchDegrees.fulfilled,

        (state, action) => {
          state.degrees.status = "succeeded";

          state.degrees.list = action.payload.results;
        },
      )

      .addCase(
        fetchDepartments.pending,

        (state) => {
          state.departments.status = "loading";
        },
      )

      .addCase(
        fetchDepartments.fulfilled,

        (state, action) => {
          state.departments.status = "succeeded";

          state.departments.list = action.payload.results;
        },
      )

      .addCase(
        fetchPrograms.pending,

        (state) => {
          state.programs.status = "loading";
        },
      )

      .addCase(
        fetchPrograms.fulfilled,

        (state, action) => {
          state.programs.status = "succeeded";

          state.programs.list = action.payload.results;
        },
      )

      .addCase(
        fetchBatches.pending,

        (state) => {
          state.batches.status = "loading";
        },
      )

      .addCase(
        fetchBatches.fulfilled,

        (state, action) => {
          state.batches.status = "succeeded";

          state.batches.list = action.payload.results;
        },
      )

      .addCase(
        fetchSections.pending,

        (state) => {
          state.sections.status = "loading";
        },
      )

      .addCase(
        fetchSections.fulfilled,

        (state, action) => {
          state.sections.status = "succeeded";

          state.sections.list = action.payload.results;
        },
      )

      .addCase(
        fetchSubjects.pending,

        (state) => {
          state.subjects.status = "loading";
        },
      )

      .addCase(
        fetchSubjects.fulfilled,

        (state, action) => {
          state.subjects.status = "succeeded";

          state.subjects.list = action.payload.results;
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

export const { clearAcademicError } = academicSlice.actions;

export default academicSlice.reducer;
