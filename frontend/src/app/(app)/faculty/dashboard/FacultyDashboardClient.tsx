// app/faculty/dashboard/FacultyDashboardClient.tsx
"use client";
import { useEffect, useState } from "react";
import { djangoService } from "@/services/djangoService";
import { Course } from "@/types/index";

type Props = {
  accessToken: string;
};

const FacultyDashboardClient = ({ accessToken }: Props) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await djangoService.getCourses({ access: accessToken });
        setCourses(data);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [accessToken]);

  if (loading) return <p>Loading courses...</p>;
  if (!courses.length) return <p>No courses found.</p>;

  return (
    <div className="flex flex-col p-4 w-full h-full bg-white text-black">
      <h2 className="text-lg font-semibold">All Courses</h2>
      <ul>
        {courses.map((course) => (
          <li
            className="flex flex-col w-64 h-32 shadow-lg border-black border p-2 rounded-md shadow-gray-50"
            key={course.id}
          >
            <p>
              <strong>{course.title}</strong> - {course.description}
            </p>
            <strong>{course.instructor}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FacultyDashboardClient;
