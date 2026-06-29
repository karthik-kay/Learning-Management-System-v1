// "use client";

// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useParams } from "next/navigation";
// import { AppDispatch, RootState } from "@/redux/store";
// import { fetchCourseDetail } from "@/redux/slices/coursesSlice";
// import CourseSidebar from "@/components/layouts/CourseSidebar";

// export default function LessonLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const { courseId } = useParams<{
//     courseId: string;
//     moduleId: string;
//     lessonId: string;
//   }>();

//   const courseIdNum = Number(courseId);
//   const dispatch = useDispatch<AppDispatch>();

//   const course = useSelector((s: RootState) => s.courses.detail);
//   const status = useSelector((s: RootState) => s.courses.detailStatus);

//   useEffect(() => {
//     if (!course || course.id !== courseIdNum) {
//       dispatch(fetchCourseDetail(courseIdNum));
//     }
//   }, [courseIdNum, course, dispatch]);

//   if (!course || status === "loading") {
//     return <div className="p-6">Loading course…</div>;
//   }

//   return (
//     <div className="flex h-screen bg-[#F4F7FE]">
//       {/* SIDEBAR */}
//       <aside className="hidden lg:block w-80 border-r bg-white">
//         <CourseSidebar course={course} />
//       </aside>

//       {/* CONTENT */}
//       <main className="flex-1 flex flex-col overflow-y-auto">{children}</main>
//     </div>
//   );
// }

"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchCourseDetail } from "@/redux/slices/coursesSlice";
import CourseSidebar from "@/components/layouts/CourseSidebar";
import { isInstructorLed } from "@/lib/courseType";

export default function LessonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { courseId } = useParams<{
    courseId: string;
    moduleId: string;
    lessonId: string;
  }>();

  const courseIdNum = Number(courseId);
  const dispatch = useDispatch<AppDispatch>();

  const course = useSelector((s: RootState) => s.courses.detail);
  const status = useSelector((s: RootState) => s.courses.detailStatus);

  useEffect(() => {
    if (!course || course.id !== courseIdNum) {
      dispatch(fetchCourseDetail(courseIdNum));
    }
  }, [courseIdNum, course, dispatch]);

  if (!course || status === "loading") {
    return <div className="p-6">Loading course…</div>;
  }

  const instructorLed = isInstructorLed(course);

  return (
    <div className="flex h-screen bg-[#F4F7FE]">
      {/* SIDEBAR */}
      <aside className="hidden lg:block w-80 border-r bg-white">
        <CourseSidebar course={course} />
      </aside>

      {/* CONTENT */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* 🔹 COURSE TYPE INDICATOR (LOGIC VISIBILITY) */}
        {instructorLed && (
          <div className="bg-blue-600 text-white text-sm px-6 py-2">
            Instructor-led course · Live sessions & deadlines apply
          </div>
        )}

        {children}
      </main>
    </div>
  );
}
