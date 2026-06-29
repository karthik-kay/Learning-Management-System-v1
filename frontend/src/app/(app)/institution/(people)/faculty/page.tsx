import { cookies } from "next/headers";

import { InstitutionFacultyWrapper } from "@/components/institution/faculty/wrapper/InstitutionFacultyWrapper";
import type { UserRole } from "@/types/auth";

export default async function InstitutionFacultyPage() {
  const cookieStore = await cookies();
  const role =
    (cookieStore.get("user_role")?.value as UserRole) || "institution_admin";

  return <InstitutionFacultyWrapper role={role} />;
}
