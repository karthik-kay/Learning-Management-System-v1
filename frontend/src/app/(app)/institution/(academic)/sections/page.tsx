import { cookies } from "next/headers";

import { AcademicStructureDirectory } from "@/components/institution/structure/AcademicStructureDirectory";
import type { UserRole } from "@/types/auth";

export default async function InstitutionSectionsPage() {
  const cookieStore = await cookies();
  const role =
    (cookieStore.get("user_role")?.value as UserRole) || "institution_admin";

  return <AcademicStructureDirectory kind="section" role={role} />;
}
