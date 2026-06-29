"use client";

import type { UserRole } from "@/types/auth";

import { AdminGradesView } from "../variants/AdminGradesView";
import { HodGradesView } from "../variants/HodGradesView";

interface InstitutionGradesWrapperProps {
  role: UserRole;
}

export function InstitutionGradesWrapper({
  role,
}: InstitutionGradesWrapperProps) {
  if (role === "hod") {
    return <HodGradesView />;
  }

  return <AdminGradesView />;
}
