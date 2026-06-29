import { CompletedCourse } from "@/types/enrollment";

interface CompletedCoursesListProps {
  courses: CompletedCourse[];
}

export function CompletedCoursesList({ courses }: CompletedCoursesListProps) {
  return (
    <div className="space-y-4">
      {courses.map((course) => (
        <div
          key={course.course_id}
          className="p-4 bg-white rounded-md shadow-sm border"
        >
          <h3 className="text-lg font-semibold">{course.course_title}</h3>
          <p className="text-sm text-gray-500">
            Completed: {new Date(course.completed_at).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
}
