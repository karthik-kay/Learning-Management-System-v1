import { createSlice, createAsyncThunk, isRejected } from "@reduxjs/toolkit"; // 1. Import isRejected
import { Course } from "@/types";
import { djangoService } from "@/services/djangoService";

interface CourseState {
  list: Course[];
  detail: Course | null;
  listStatus: "idle" | "loading" | "succeeded" | "failed";
  detailStatus: "idle" | "loading" | "succeeded" | "failed";
  error: string | null; // 2. Make this consistent (string | null)
}

const initialState: CourseState = {
  list: [],
  detail: null,
  listStatus: "idle",
  detailStatus: "idle",
  error: null,
};

export const fetchCourses = createAsyncThunk<Course[]>(
  "courses/fetchAll",
  async () => {
    return await djangoService.getCourses();
  }
);

export const fetchCourseDetail = createAsyncThunk<Course, number>(
  "courses/fetchDetail",
  async (courseId) => {
    return await djangoService.getCourse(courseId);
  }
);

const coursesSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    clearCourseDetail: (state) => {
      state.detail = null;
    },
    clearCourseError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.listStatus = "loading";
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.list = action.payload;
        state.error = null;
      })

      .addCase(fetchCourseDetail.pending, (state) => {
        state.detailStatus = "loading";
        state.error = null;
      })
      .addCase(fetchCourseDetail.fulfilled, (state, action) => {
        state.detailStatus = "succeeded";
        state.detail = action.payload;
        state.error = null;
      })

      .addMatcher(isRejected, (state, action) => {
        if (action.type.includes("fetchAll")) state.listStatus = "failed";
        if (action.type.includes("fetchDetail")) state.detailStatus = "failed";

        if (action.error?.message === "AUTH_SESSION_EXPIRED") {
          state.error = "AUTH_SESSION_EXPIRED";
        } else {
          state.error = action.error?.message || "FETCH_ERROR";
        }
      });
  },
});

export const { clearCourseDetail, clearCourseError } = coursesSlice.actions;
export default coursesSlice.reducer;
