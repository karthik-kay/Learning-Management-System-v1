import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchDashboard } from "@/redux/slices/dashboardSlice";
import {
  fetchCompletedEnrollments,
  fetchEnrollments,
} from "@/redux/slices/enrollmentsSlice";
import { fetchContinueCourses } from "@/redux/slices/courseContinueSlice";

export function useDashboardOverviewData() {
  const dispatch = useDispatch<AppDispatch>();

  const dashboard = useSelector((s: RootState) => s.dashboard);
  const enrollments = useSelector((s: RootState) => s.enrollments);
  const courseContinue = useSelector((s: RootState) => s.courseContinue);
  const user = useSelector((s: RootState) => s.user.profile);

  useEffect(() => {
    if (dashboard.status === "idle") dispatch(fetchDashboard());
    if (enrollments.enrollmentsStatus === "idle") dispatch(fetchEnrollments());
    if (enrollments.completedStatus === "idle")
      dispatch(fetchCompletedEnrollments());
    if (courseContinue.status === "idle") dispatch(fetchContinueCourses());
  }, [
    dispatch,
    dashboard.status,
    enrollments.enrollmentsStatus,
    enrollments.completedStatus,
    courseContinue.status,
  ]);

  const isLoading =
    dashboard.status === "loading" ||
    enrollments.enrollmentsStatus === "loading" ||
    enrollments.completedStatus === "loading" ||
    courseContinue.status === "loading" ||
    !dashboard.base ||
    !user;

  return {
    dashboard,
    enrollments,
    courseContinue,
    user,
    isLoading,
  };
}
