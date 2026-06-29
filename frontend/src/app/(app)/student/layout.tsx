// src/app/(app)/student/layout.tsx
import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import StudentLayoutClient from "./StudentLayoutClient";

interface StudentLayoutProps {
  children: React.ReactNode;
}

export default async function StudentLayout({ children }: StudentLayoutProps) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token");
  const userRole = cookieStore.get("user_role")?.value;

  // Read the sidebar state from cookies
  const collapsedCookie = cookieStore.get("sidebar-collapsed");
  const initialCollapsed = collapsedCookie?.value === "true";

  if (!accessToken || userRole !== "student") redirect("/login");

  return (
    <StudentLayoutClient initialCollapsed={initialCollapsed}>
      {children}
    </StudentLayoutClient>
  );
}
