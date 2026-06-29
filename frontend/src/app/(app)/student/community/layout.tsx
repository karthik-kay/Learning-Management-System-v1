"use client";
import { StudentCommunityShell } from "@/components/auth/student/community";

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StudentCommunityShell>{children}</StudentCommunityShell>;
}
