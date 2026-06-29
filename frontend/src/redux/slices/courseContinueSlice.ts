import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { djangoService } from "@/services/djangoService";
import { ContinueCourseItem } from "@/types";

interface CourseContinueState {
  activeCourses: ContinueCourseItem[];
  status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: CourseContinueState = {
  activeCourses: [],
  status: "idle",
};

export const fetchContinueCourses = createAsyncThunk<ContinueCourseItem[]>(
  "courseContinue/fetchActive",
  async () => await djangoService.getContinueCourses()
);

const courseContinueSlice = createSlice({
  name: "courseContinue",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchContinueCourses.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchContinueCourses.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.activeCourses = action.payload;
      })
      .addCase(fetchContinueCourses.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default courseContinueSlice.reducer;
