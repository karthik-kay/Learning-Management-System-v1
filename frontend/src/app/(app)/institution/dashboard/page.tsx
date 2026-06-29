// app/(app)/institution/dashboard/page.tsx
import { cookies } from "next/headers";
import AdminDashboard from "@/components/institution/dashboard/variants/AdminDashboard";
import { HodDashboard } from "@/components/institution/dashboard/variants/HodDashboard";
import { UserRole } from "@/types/auth"; // Assuming you have your role types here

export default async function InstitutionDashboardPage() {
  // 1. Await the cookies (Next.js 15 requirement)
  const cookieStore = await cookies();

  // 2. Safely grab the role, default to institution_admin if missing
  const role =
    (cookieStore.get("user_role")?.value as UserRole) || "institution_admin";

  // 3. The Bouncer: Render the exact variant they need
  if (role === "hod") {
    // You can build the HodDashboard next using the exact same pattern!
    return <HodDashboard />;
  }

  // Default for institution admins
  return <AdminDashboard />;
}
