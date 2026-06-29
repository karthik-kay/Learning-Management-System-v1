import { cookies } from "next/headers";

import { InstitutionGradesWrapper } from "@/components/institution/grades/wrapper/InstitutionGradesWrapper";
import type { UserRole } from "@/types/auth";

export default async function InstitutionGradesPage() {
  const cookieStore = await cookies();
  const role =
    (cookieStore.get("user_role")?.value as UserRole) || "institution_admin";

  return <InstitutionGradesWrapper role={role} />;
}
