import { cookies } from "next/headers";

import { InstitutionAssessmentsWrapper } from "@/components/institution/assessments/wrapper/InstitutionAssessmentsWrapper";
import type { UserRole } from "@/types/auth";

export default async function InstitutionAssessmentsPage() {
  const cookieStore = await cookies();
  const role =
    (cookieStore.get("user_role")?.value as UserRole) || "institution_admin";

  return <InstitutionAssessmentsWrapper role={role} />;
}
