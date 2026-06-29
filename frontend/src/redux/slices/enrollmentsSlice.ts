import { createSlice, createAsyncThunk, isRejected } from "@reduxjs/toolkit"; // 1. Import isRejected
import { djangoService } from "@/services/djangoService";
import { Enrollment, CompletedCourse } from "@/types";

interface EnrollmentState {
  enrollments: Enrollment[];
  completed: CompletedCourse[];
  enrollmentsStatus: "idle" | "loading" | "succeeded" | "failed";
  completedStatus: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: EnrollmentState = {
  enrollments: [],
  completed: [],
  enrollmentsStatus: "idle",
  completedStatus: "idle",
  error: null,
};

export const fetchEnrollments = createAsyncThunk<Enrollment[]>(
  "enrollments/fetchAll",
  async () => await djangoService.getEnrollments()
);

export const fetchCompletedEnrollments = createAsyncThunk<CompletedCourse[]>(
  "enrollments/fetchCompleted",
  async () => await djangoService.getCompletedCourses()
);

const enrollmentsSlice = createSlice({
  name: "enrollments",
  initialState,
  reducers: {
    resetEnrollmentError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEnrollments.pending, (state) => {
        state.enrollmentsStatus = "loading";
        state.error = null;
      })
      .addCase(fetchEnrollments.fulfilled, (state, action) => {
        state.enrollmentsStatus = "succeeded";
        state.enrollments = action.payload;
      })

      .addCase(fetchCompletedEnrollments.pending, (state) => {
        state.completedStatus = "loading";
        state.error = null;
      })
      .addCase(fetchCompletedEnrollments.fulfilled, (state, action) => {
        state.completedStatus = "succeeded";
        state.completed = action.payload;
      })

      .addMatcher(isRejected, (state, action) => {
        if (action.type.includes("fetchAll"))
          state.enrollmentsStatus = "failed";
        if (action.type.includes("fetchCompleted"))
          state.completedStatus = "failed";

        if (action.error?.message === "AUTH_SESSION_EXPIRED") {
          state.error = "AUTH_SESSION_EXPIRED";
        } else {
          state.error = action.error?.message || "ENROLLMENT_FETCH_ERROR";
        }
      });
  },
});

export const { resetEnrollmentError } = enrollmentsSlice.actions;
export default enrollmentsSlice.reducer;
