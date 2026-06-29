import { djangoService } from "@/services/djangoService";
import { LessonQueueItem } from "@/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface LessonQueueState {
  lessons: LessonQueueItem[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: LessonQueueState = {
  lessons: [],
  status: "idle",
  error: null,
};

export const fetchLessonQueue = createAsyncThunk<
  LessonQueueItem[],
  void,
  { rejectValue: string }
>("lessonQueue/fetchlessonQueue", async (_, { rejectWithValue }) => {
  try {
    const res = await djangoService.getLessonQueue();
    return res.queue;
  } catch {
    return rejectWithValue("Failed to load lesson queue");
  }
});

const lessonQueueSlice = createSlice({
  name: "lessonQueue",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLessonQueue.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchLessonQueue.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.lessons = action.payload;
      })
      .addCase(fetchLessonQueue.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Unknown error";
      });
  },
});

export default lessonQueueSlice.reducer;
