import { publicService } from "@/services/public";
import { PublicCourseProvider } from "@/context/PublicCourseContext";
import PublicCoursePageClient from "../../../../../components/courses/public/PublicCoursePageClient";

export default async function Page({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const id = Number(courseId);

  const course = await publicService.getPublicCourse(id);

  return (
    <PublicCourseProvider initialCourse={course}>
      <PublicCoursePageClient />
    </PublicCourseProvider>
  );
}
