"use client";

import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { RootState } from "@/redux/store";
import { logout as logoutAction } from "@/redux/slices/authSlice";

export function useAuth() {
  const dispatch = useDispatch();

  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  const dashError = useSelector((state: RootState) => state.dashboard.error);
  const enrollError = useSelector(
    (state: RootState) => state.enrollments.error
  );
  const courseError = useSelector((state: RootState) => state.courses.error);

  const logout = useCallback(() => {
    dispatch(logoutAction());

    localStorage.setItem("logout_event", Date.now().toString());

    window.location.href = "/login?reason=session_expired";
  }, [dispatch]);

  // Kill-switch from API
  useEffect(() => {
    const hasExpired = [dashError, enrollError, courseError].includes(
      "AUTH_SESSION_EXPIRED"
    );

    if (hasExpired && isAuthenticated) {
      console.warn("Session expired. Logging out.");
      logout();
    }
  }, [dashError, enrollError, courseError, isAuthenticated, logout]);

  // Cross-tab sync
  useEffect(() => {
    const syncLogout = (e: StorageEvent) => {
      if (e.key === "logout_event") {
        window.location.href = "/login";
      }
    };
    window.addEventListener("storage", syncLogout);
    return () => window.removeEventListener("storage", syncLogout);
  }, []);

  return { logout, isAuthenticated };
}
