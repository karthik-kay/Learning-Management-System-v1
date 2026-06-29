import { cookies } from "next/headers";

import { InstitutionExamsWrapper } from "@/components/institution/exams/wrapper/InstitutionExamsWrapper";
import type { UserRole } from "@/types/auth";

export default async function InstitutionExamsPage() {
  const cookieStore = await cookies();
  const role =
    (cookieStore.get("user_role")?.value as UserRole) || "institution_admin";

  return <InstitutionExamsWrapper role={role} />;
}
