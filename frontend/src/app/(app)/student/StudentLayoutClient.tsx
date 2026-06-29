"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import Cookies from "js-cookie";
import Header from "@/components/layout/auth-layout/student-app-layout/Header";
import { ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchDashboard } from "@/redux/slices/dashboardSlice";
import { fetchUserProfile } from "@/redux/slices/userSlice";
import { useAuth } from "@/hooks/useAuth";

const StudentSidebar = dynamic(
  () => import("@/components/compositions/student/StudentSidebar"),
  {
    ssr: false,
    loading: () => (
      <div className="h-full bg-white border-r animate-pulse w-full" />
    ),
  },
);

export default function StudentLayoutClient({
  children,
  initialCollapsed,
}: {
  children: ReactNode;
  initialCollapsed: boolean;
}) {
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  useAuth();

  const [collapsed, setCollapsed] = useState(initialCollapsed);
  const user = useSelector((state: RootState) => state.user.profile);
  const { monthly, status } = useSelector(
    (state: RootState) => state.dashboard,
  );

  const handleToggle = (value: boolean) => {
    setCollapsed(value);
    Cookies.set("sidebar-collapsed", String(value), { expires: 365 });
  };

  useEffect(() => {
    if (!user) dispatch(fetchUserProfile());
  }, [dispatch, user]);

  useEffect(() => {
    if (status === "idle" && !monthly) dispatch(fetchDashboard());
  }, [status, monthly, dispatch]);

  const isWorkspace =
    pathname.startsWith("/student/course/") ||
    pathname.startsWith("/student/ide/") ||
    pathname.startsWith("/student/assessment/");

  // Workspace View: Header Fixed, Body Scrolls
  if (isWorkspace) {
    return (
      <div className="flex flex-col h-screen overflow-hidden bg-[#F4F7FE]">
        <div className="shrink-0">
          <Header user={user} />
        </div>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#F4F7FE]">
      <header className="shrink-0 bg-white border-b border-slate-200 z-30">
        <Header user={user} />
      </header>

      <div className="flex  flex-1 min-w-0 overflow-hidden">
        <aside
          className={`bg-white border-r border-slate-200 transition-all duration-300 ease-in-out flex-shrink-0  ${
            collapsed ? "w-16" : "w-48"
          }`}
        >
          <StudentSidebar collapsed={collapsed} setCollapsed={handleToggle} />
        </aside>

        <main className="flex-1 w-full overflow-auto goals-scroll  bg-[#F4F7FE] ">
          {children}
        </main>
      </div>
    </div>
  );
}
