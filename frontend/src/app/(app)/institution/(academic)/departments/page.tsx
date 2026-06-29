import { cookies } from "next/headers";

import { InstitutionDepartmentsWrapper } from "@/components/institution/departments/wrapper/InstitutionDepartmentsWrapper";
import type { UserRole } from "@/types/auth";

export default async function InstitutionDepartmentsPage() {
  const cookieStore = await cookies();
  const role =
    (cookieStore.get("user_role")?.value as UserRole) || "institution_admin";

  return <InstitutionDepartmentsWrapper role={role} />;
}
