import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { djangoService } from "@/services/djangoService";
import { QuizAttempt } from "@/types/index";

interface AssessmentState {
  recent: QuizAttempt[];
  latest?: QuizAttempt;
  loading: boolean;
  error?: string;
}

const initialState: AssessmentState = {
  recent: [],
  latest: undefined,
  loading: false,
  error: undefined,
};

export const fetchQuizHistory = createAsyncThunk(
  "assessments/fetchHistory",
  async (_, { rejectWithValue }) => {
    try {
      return await djangoService.getQuizHistory();
    } catch (err: unknown) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue("Unknown error occurred");
    }
  }
);

export const saveLatestAttempt = createAsyncThunk(
  "assessments/saveLatest",
  async (attemptId: number, { rejectWithValue }) => {
    try {
      const attempts = await djangoService.getQuizAttempts(attemptId);
      return attempts[0]; // Latest attempt first
    } catch (err: unknown) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue("Unknown error occurred");
    }
  }
);

const assessmentSlice = createSlice({
  name: "assessments",
  initialState,
  reducers: {
    clearLatestResult: (state) => {
      state.latest = undefined;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchQuizHistory.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      fetchQuizHistory.fulfilled,
      (state, action: PayloadAction<QuizAttempt[]>) => {
        state.loading = false;
        state.recent = action.payload;
      }
    );
    builder.addCase(fetchQuizHistory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    builder.addCase(
      saveLatestAttempt.fulfilled,
      (state, action: PayloadAction<QuizAttempt>) => {
        state.latest = action.payload;
      }
    );
  },
});

export const { clearLatestResult } = assessmentSlice.actions;
export default assessmentSlice.reducer;
