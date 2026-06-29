import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { djangoService } from "@/services/djangoService";
import { Task, CreateTaskData, UpdateTaskData } from "@/types";

interface TasksState {
  list: Task[];
  status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: TasksState = {
  list: [],
  status: "idle",
};

export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async () => {
  return await djangoService.getTasks();
});

export const addTask = createAsyncThunk(
  "tasks/addTask",
  async (taskData: CreateTaskData) => {
    return await djangoService.createTask(taskData);
  }
);

export const modifyTask = createAsyncThunk(
  "tasks/modifyTask",
  async ({ id, data }: { id: number; data: UpdateTaskData }) => {
    return await djangoService.updateTask(id, data);
  }
);

export const completeTaskThunk = createAsyncThunk(
  "tasks/completeTask",
  async (id: number) => {
    await djangoService.completeTask(id);
    return id;
  }
);

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.list = action.payload;
        state.status = "succeeded";
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(modifyTask.fulfilled, (state, action) => {
        const index = state.list.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(completeTaskThunk.fulfilled, (state, action) => {
        const task = state.list.find((t) => t.id === action.payload);
        if (task) {
          task.completed = true;
          task.progress = 100;
        }
      });
  },
});

export default tasksSlice.reducer;
