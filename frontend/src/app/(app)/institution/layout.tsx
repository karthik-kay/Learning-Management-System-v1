// app/(app)/institution/layout.tsx
import { ReactNode } from "react";
import { cookies } from "next/headers";
import { InstitutionShell } from "@/components/institution/layout/shell/InstitutionShell";
import { AdminSidebar } from "@/components/institution/layout/sidebar/variants/AdminSidebar";
import { HodSidebar } from "@/components/institution/layout/sidebar/variants/HodSidebar";
import { SharedHeader } from "@/components/institution/layout/header/variants/SharedHeader";

// Import that type you just showed me!
import { UserRole } from "@/types/auth";

export default async function InstitutionLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = await cookies();

  // Cast the cookie value to your strict UserRole type
  const role =
    (cookieStore.get("user_role")?.value as UserRole) || "institution_admin";

  // Resolve the correct sidebar variant using strict type checking
  let SidebarVariant;

  if (role === "hod") {
    SidebarVariant = <HodSidebar />;
  } else if (role === "faculty") {
    // You can build FacultySidebar using the exact same pattern later!
    SidebarVariant = <div>Faculty Sidebar (Placeholder)</div>;
  } else {
    // Defaults to institution_admin for this layout boundary
    SidebarVariant = <AdminSidebar />;
  }

  const HeaderVariant = <SharedHeader />;

  return (
    <InstitutionShell sidebar={SidebarVariant} header={HeaderVariant}>
      {children}
    </InstitutionShell>
  );
}
