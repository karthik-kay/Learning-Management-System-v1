"use client";

import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import type { RootState, AppDispatch } from "@/redux/store";

import { fetchAdminDashboard } from "@/redux/institution/dashboard.slice";

export function useAdminDashboard() {
  const dispatch = useDispatch<AppDispatch>();

  const admin = useSelector(
    (state: RootState) => state.institutionDashboard.admin,
  );

  const error = useSelector(
    (state: RootState) => state.institutionDashboard.error,
  );

  useEffect(() => {
    if (admin.status === "idle") {
      dispatch(fetchAdminDashboard());
    }
  }, [dispatch, admin.status]);

  return {
    dashboard: admin.data,

    isLoading: admin.status === "loading",

    isError: admin.status === "failed",

    error,
  };
}
