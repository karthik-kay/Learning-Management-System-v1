"use client";

import type { UserRole } from "@/types/auth";

import { AdminProgramsView } from "../variants/AdminProgramsView";
import { HodProgramsView } from "../variants/HodProgramsView";

interface InstitutionProgramsWrapperProps {
  role: UserRole;
}

export function InstitutionProgramsWrapper({ role }: InstitutionProgramsWrapperProps) {
  if (role === "hod") {
    return <HodProgramsView />;
  }

  return <AdminProgramsView />;
}
