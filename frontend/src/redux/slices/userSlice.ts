import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { UserProfile } from "@/types/auth";
import { djangoService } from "@/services/djangoService";

export const fetchUserProfile = createAsyncThunk<UserProfile>(
  "user/fetchProfile",
  async () => {
    return await djangoService.getUser();
  }
);

interface UserState {
  profile: UserProfile | null;
  status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: UserState = {
  profile: null,
  status: "idle",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default userSlice.reducer;
