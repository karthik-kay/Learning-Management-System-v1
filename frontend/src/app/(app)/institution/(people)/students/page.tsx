import { cookies } from "next/headers";

import { InstitutionStudentsWrapper } from "@/components/institution/students/wrapper/InstitutionStudentsWrapper";
import type { UserRole } from "@/types/auth";

export default async function InstitutionStudentsPage() {
  const cookieStore = await cookies();
  const role =
    (cookieStore.get("user_role")?.value as UserRole) || "institution_admin";

  return <InstitutionStudentsWrapper role={role} />;
}
