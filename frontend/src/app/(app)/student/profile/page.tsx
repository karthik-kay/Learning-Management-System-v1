"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Stack } from "@/components/shared/primitives";

import { ProfileHeaderSection } from "@/components/compositions/student/dashboard/profile/ProfileHeaderSection";
import { useRouter } from "next/navigation";
export default function ProfileView() {
  const dashboard = useSelector((s: RootState) => s.dashboard.base);
  const enrollments = useSelector((s: RootState) => s.enrollments.enrollments);
  const user = useSelector((s: RootState) => s.user.profile);
  const router = useRouter();
  if (!dashboard || !user) return null;

  const completed = enrollments.filter((e) => e.is_completed);
  const active = enrollments.filter((e) => !e.is_completed);
  const displayName =
    user.first_name && user.first_name.trim().length > 0
      ? user.first_name
      : "Student";

  const bio = user.bio ?? undefined;

  const completionRate =
    enrollments.length > 0
      ? Math.round((completed.length / enrollments.length) * 100)
      : 0;

  const rank =
    completed.length >= 10
      ? "Advanced"
      : completed.length >= 5
        ? "Intermediate"
        : "Beginner";

  const profileStats = [
    { label: "Completed", value: completed.length },
    { label: "Active", value: active.length },
    {
      label: "Learning Hours",
      value: `${dashboard.lifetime_learning_hours.toLocaleString()}h`,
    },
    { label: "Completion", value: `${completionRate}%` },
  ];

  return (
    <Stack gap={32} className="p-6">
      <ProfileHeaderSection
        avatar={{
          name: displayName,
          subtitle: rank,
        }}
        info={[
          { label: "Email", value: user.email },
          { label: "Joined", value: user.date_joined },
        ]}
        bio={bio}
        stats={profileStats}
      />
      <button
        onClick={() => router.push("/student/resume-builder")}
        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-gray-300 text-sm text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-colors w-fit"
      >
        Build My ATS Resume →
      </button>
    </Stack>
  );
}
