import { cookies } from "next/headers";

import { InstitutionProgramsWrapper } from "@/components/institution/programs/wrapper/InstitutionProgramsWrapper";
import type { UserRole } from "@/types/auth";

export default async function InstitutionProgramsPage() {
  const cookieStore = await cookies();
  const role =
    (cookieStore.get("user_role")?.value as UserRole) || "institution_admin";

  return <InstitutionProgramsWrapper role={role} />;
}
