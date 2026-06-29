import FacultyDashboardClient from "./FacultyDashboardClient";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export default async function FacultyDashboard() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value || "";
  return <FacultyDashboardClient accessToken={accessToken} />;
}
