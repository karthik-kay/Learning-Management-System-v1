import { ContinueCourseItem, Enrollment } from "@/types";

export function buildPrimaryCta({
  isLoading,
  ongoingCourses,
  allEnrollments,
}: {
  isLoading: boolean;
  ongoingCourses: ContinueCourseItem[];
  allEnrollments: Enrollment[];
}) {
  if (isLoading) {
    return {
      label: "Loading your personalized dashboard...",
      description: "We're checking your course progress.",
      actionLabel: "Loading...",
      href: "#",
      loading: true,
    };
  }

  if (ongoingCourses.length > 0) {
    const c = ongoingCourses[0];
    return {
      label: `Continue: ${c.course_title}`,
      description: `Jump back to "${c.lesson_title}" in ${c.module_title}.`,
      actionLabel: "Continue Learning",
      href: `/courses/${c.course_id}/modules/${c.module_id}/lessons/${c.lesson_id}`,
    };
  }

  if (allEnrollments.length === 0) {
    return {
      label: "Ready to Begin Your Journey?",
      description:
        "It looks like you haven't enrolled in any courses yet. Get started now!",
      actionLabel: "Explore Courses",
      href: "/courses",
    };
  }

  return {
    label: "You're All Caught Up!",
    description:
      "You've finished your current courses. Find your next skill to master.",
    actionLabel: "Find Next Challenge",
    href: "/explore",
  };
}
