"use client";

import type { UserRole } from "@/types/auth";

import { AdminDepartmentsView } from "../variants/AdminDepartmentsView";
import { HodDepartmentsView } from "../variants/HodDepartmentsView";

interface InstitutionDepartmentsWrapperProps {
  role: UserRole;
}

export function InstitutionDepartmentsWrapper({
  role,
}: InstitutionDepartmentsWrapperProps) {
  if (role === "hod") {
    return <HodDepartmentsView />;
  }

  return <AdminDepartmentsView />;
}
