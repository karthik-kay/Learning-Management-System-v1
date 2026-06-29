// /faculty/dashboard/layout.tsx
import React from "react";
import { cookies } from "next/headers"; // Special Next.js function to read cookies on the server
import { redirect } from "next/navigation";
import FacultySidebar from "@/components/compositions/faculty/FacultySidebar";

interface FacultyLayoutProps {
  children: React.ReactNode;
}

export default async function FacultyDashboardLayout({
  children,
}: FacultyLayoutProps) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token");
  const userRole = cookieStore.get("user_role")?.value;

  if (!accessToken || userRole !== "faculty") {
    // If no token or wrong role, redirect to the login page
    redirect("/");
  }
  return (
    <div className="flex min-h-screen">
      <FacultySidebar />
      <main className="flex-1 bg-white">{children}</main>
    </div>
  );
}
