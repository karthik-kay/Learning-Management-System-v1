// app/(app)/student/courses/explore/page.tsx
import { publicService } from "@/services/public";
import ExploreClient from "./ExploreClient";

export default async function ExploreCoursesPage() {
  const courses = await publicService.getPublicCourses();

  return <ExploreClient courses={courses} />;
}
