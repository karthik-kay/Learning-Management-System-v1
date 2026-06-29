// src/app/admin/layout.tsx
import { cookies } from "next/headers"; // Special Next.js function to read cookies on the server
import { redirect } from "next/navigation"; // Function for server-side redirection
import AdminSidebar from "@/components/compositions/admin/AdminSidebar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  // 1. Read the necessary cookies on the server
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token");
  const userRole = cookieStore.get("user_role")?.value;

  // 2. Authorization Check
  if (!accessToken || userRole !== "admin") {
    // If no token or wrong role, redirect to the login page
    redirect("/");
  }

  // NOTE: You would typically also validate the token with your backend here

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="grow p-6 bg-gray-50">{children}</main>
    </div>
  );
}
