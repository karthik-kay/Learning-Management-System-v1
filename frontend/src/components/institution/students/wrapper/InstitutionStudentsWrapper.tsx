"use client";

import type { UserRole } from "@/types/auth";

import { AdminStudentsView } from "../variants/AdminStudentsView";
import { HodStudentsView } from "../variants/HodStudentsView";

interface InstitutionStudentsWrapperProps {
  role: UserRole;
}

export function InstitutionStudentsWrapper({
  role,
}: InstitutionStudentsWrapperProps) {
  if (role === "hod") {
    return <HodStudentsView />;
  }

  return <AdminStudentsView />;
}
