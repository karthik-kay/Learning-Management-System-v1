import { createSlice, createAsyncThunk, isRejected } from "@reduxjs/toolkit";

import { djangoService } from "@/services/djangoService";

import { PaginatedResponse } from "@/types/institution/common";

import {
  Exam,
  ExamResult,
  EvaluationComponent,
  StudentComponentScore,
  SubjectResult,
} from "@/types/institution/grades";

type RequestStatus = "idle" | "loading" | "succeeded" | "failed";

interface GradesState {
  exams: {
    list: Exam[];

    status: RequestStatus;
  };

  results: {
    list: ExamResult[];

    status: RequestStatus;
  };

  components: {
    list: EvaluationComponent[];

    status: RequestStatus;
  };

  scores: {
    list: StudentComponentScore[];

    status: RequestStatus;
  };

  subjectResults: {
    list: SubjectResult[];

    status: RequestStatus;
  };

  error: string | null;
}

const initialState: GradesState = {
  exams: {
    list: [],

    status: "idle",
  },

  results: {
    list: [],

    status: "idle",
  },

  components: {
    list: [],

    status: "idle",
  },

  scores: {
    list: [],

    status: "idle",
  },

  subjectResults: {
    list: [],

    status: "idle",
  },

  error: null,
};

export const fetchExams = createAsyncThunk<PaginatedResponse<Exam>>(
  "grades/exams",

  async () => {
    return await djangoService.getExams();
  },
);

export const fetchResults = createAsyncThunk<ExamResult[]>(
  "grades/results",

  async () => {
    return await djangoService.getResults();
  },
);

export const fetchEvaluationComponents = createAsyncThunk<
  EvaluationComponent[]
>(
  "grades/components",

  async () => {
    return await djangoService.getEvaluationComponents();
  },
);

export const fetchStudentScores = createAsyncThunk<StudentComponentScore[]>(
  "grades/scores",

  async () => {
    return await djangoService.getStudentScores();
  },
);

export const fetchSubjectResults = createAsyncThunk<SubjectResult[]>(
  "grades/subjectResults",

  async () => {
    return await djangoService.getSubjectResults();
  },
);

const gradesSlice = createSlice({
  name: "grades",

  initialState,

  reducers: {
    clearGradesError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(
        fetchExams.pending,

        (state) => {
          state.exams.status = "loading";
        },
      )

      .addCase(
        fetchExams.fulfilled,

        (state, action) => {
          state.exams.status = "succeeded";

          state.exams.list = action.payload.results;
        },
      )

      .addCase(
        fetchResults.pending,

        (state) => {
          state.results.status = "loading";
        },
      )

      .addCase(
        fetchResults.fulfilled,

        (state, action) => {
          state.results.status = "succeeded";

          state.results.list = action.payload;
        },
      )

      .addCase(
        fetchEvaluationComponents.pending,

        (state) => {
          state.components.status = "loading";
        },
      )

      .addCase(
        fetchEvaluationComponents.fulfilled,

        (state, action) => {
          state.components.status = "succeeded";

          state.components.list = action.payload;
        },
      )

      .addCase(
        fetchStudentScores.pending,

        (state) => {
          state.scores.status = "loading";
        },
      )

      .addCase(
        fetchStudentScores.fulfilled,

        (state, action) => {
          state.scores.status = "succeeded";

          state.scores.list = action.payload;
        },
      )

      .addCase(
        fetchSubjectResults.pending,

        (state) => {
          state.subjectResults.status = "loading";
        },
      )

      .addCase(
        fetchSubjectResults.fulfilled,

        (state, action) => {
          state.subjectResults.status = "succeeded";

          state.subjectResults.list = action.payload;
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

export const { clearGradesError } = gradesSlice.actions;

export default gradesSlice.reducer;
