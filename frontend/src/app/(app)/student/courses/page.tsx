import { redirect } from "next/navigation";

export default function CoursesIndex() {
  redirect("/student/courses/my-courses");
}
