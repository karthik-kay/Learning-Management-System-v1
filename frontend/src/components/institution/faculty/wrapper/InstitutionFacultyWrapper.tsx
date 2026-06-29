"use client";

import type { UserRole } from "@/types/auth";

import { AdminFacultyView } from "../variants/AdminFacultyView";
import { HodFacultyView } from "../variants/HodFacultyView";

interface InstitutionFacultyWrapperProps {
  role: UserRole;
}

export function InstitutionFacultyWrapper({ role }: InstitutionFacultyWrapperProps) {
  if (role === "hod") {
    return <HodFacultyView />;
  }

  return <AdminFacultyView />;
}
