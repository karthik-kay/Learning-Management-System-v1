"use client";

import type { UserRole } from "@/types/auth";

import { AdminAssessmentsView } from "../variants/AdminAssessmentsView";
import { HodAssessmentsView } from "../variants/HodAssessmentsView";

export function InstitutionAssessmentsWrapper({ role }: { role: UserRole }) {
  if (role === "hod") return <HodAssessmentsView />;
  return <AdminAssessmentsView />;
}
