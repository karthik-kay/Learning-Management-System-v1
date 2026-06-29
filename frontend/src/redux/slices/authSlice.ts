import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

interface AuthState {
  role: string;
  isAuthenticated: boolean;
}

const getInitialRole = () => {
  if (typeof window !== "undefined") {
    // Standardize to 'user_role' to match your layout and service
    return Cookies.get("user_role") || "";
  }
  return "";
};

const initialState: AuthState = {
  role: getInitialRole(),
  isAuthenticated: !!getInitialRole(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setRole: (state, action: PayloadAction<string>) => {
      state.role = action.payload;
      state.isAuthenticated = true;
      // Use path: "/" so it's accessible everywhere
      Cookies.set("user_role", action.payload, {
        path: "/",
        secure: true,
        sameSite: "strict",
      });
    },
    logout: (state) => {
      state.role = "";
      state.isAuthenticated = false;

      if (typeof window !== "undefined") {
        Cookies.remove("user_role", { path: "/" });
        Cookies.remove("access_token", { path: "/" });
        Cookies.remove("refresh_token", { path: "/" });
      }
    },
  },
});

export const { setRole, logout } = authSlice.actions;
export default authSlice.reducer;
