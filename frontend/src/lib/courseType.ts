import { Course } from "@/types/course";

export function isInstructorLed(course: Course): boolean {
  return course.course_type === "instructor_led";
}

export function isSelfPaced(course: Course): boolean {
  return course.course_type === "self_paced";
}
