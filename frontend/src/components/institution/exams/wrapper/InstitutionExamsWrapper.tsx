"use client";

import type { UserRole } from "@/types/auth";

import { AdminExamsView } from "../variants/AdminExamsView";
import { HodExamsView } from "../variants/HodExamsView";

export function InstitutionExamsWrapper({ role }: { role: UserRole }) {
  if (role === "hod") return <HodExamsView />;
  return <AdminExamsView />;
}
