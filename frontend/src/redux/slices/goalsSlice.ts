import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { djangoService } from "@/services/djangoService";
import { Goal, CreateGoalData, UpdateGoalData } from "@/types";

interface GoalsState {
  list: Goal[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: GoalsState = {
  list: [],
  status: "idle",
  error: null,
};

export const fetchGoals = createAsyncThunk<Goal[]>(
  "goals/fetchGoals",
  async () => {
    return await djangoService.getGoals();
  }
);

export const addGoal = createAsyncThunk<Goal, CreateGoalData>(
  "goals/addGoal",
  async (data: CreateGoalData) => {
    return await djangoService.createGoal(data);
  }
);

export const modifyGoal = createAsyncThunk<
  Goal,
  { id: number; data: UpdateGoalData }
>(
  "goals/modifyGoal",
  async ({ id, data }: { id: number; data: UpdateGoalData }) => {
    return await djangoService.updateGoal(id, data);
  }
);
export const deleteGoal = createAsyncThunk<number, number>(
  "goals/deleteGoal",
  async (id) => {
    await djangoService.deleteGoal(id);
    return id;
  }
);

export const checkInGoal = createAsyncThunk<Goal, number>(
  "goals/checkInGoal",
  async (id: number) => {
    return await djangoService.checkInGoal(id);
  }
);

const goalsSlice = createSlice({
  name: "goals",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGoals.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchGoals.fulfilled, (state, action: PayloadAction<Goal[]>) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchGoals.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to load goals";
      })
      .addCase(addGoal.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(modifyGoal.fulfilled, (state, action) => {
        const index = state.list.findIndex((g) => g.id === action.payload.id);
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(deleteGoal.fulfilled, (state, action) => {
        state.list = state.list.filter((g) => g.id !== action.payload);
      })
      .addCase(checkInGoal.fulfilled, (state, action) => {
        const index = state.list.findIndex((g) => g.id === action.payload.id);
        if (index !== -1) state.list[index] = action.payload;
      });
  },
});

export default goalsSlice.reducer;
