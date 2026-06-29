"use client";

import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import type { RootState, AppDispatch } from "@/redux/store";

import { fetchAtRiskStudents } from "@/redux/institution/report.slice";

export function useAtRiskStudents() {
  const dispatch = useDispatch<AppDispatch>();

  const atRisk = useSelector(
    (state: RootState) => state.institutionReports.atRisk,
  );

  const error = useSelector(
    (state: RootState) => state.institutionReports.error,
  );

  useEffect(() => {
    if (atRisk.status === "idle") {
      dispatch(fetchAtRiskStudents());
    }
  }, [dispatch, atRisk.status]);

  return {
    students: atRisk.list,

    isLoading: atRisk.status === "loading",

    error,
  };
}
