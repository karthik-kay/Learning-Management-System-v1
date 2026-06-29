"use client";

import { useState } from "react";
import CurriculumAccordion from "./CurriculumAccordion";

export default function CourseTabs({ course }) {
  const [tab, setTab] = useState("overview");

  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "curriculum", label: "Curriculum" },
    { key: "instructor", label: "Instructor" },
    { key: "reviews", label: "Reviews" },
  ];

  return (
    <div>
      {/* TAB BUTTONS */}
      <div className="flex gap-4 border-b pb-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`pb-2 px-2 font-medium ${
              tab === t.key
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      <div className="mt-6">
        {tab === "overview" && (
          <div>
            <h2 className="text-xl font-semibold mb-3">About this course</h2>
            <p className="text-gray-700 leading-relaxed">
              {course.description}
            </p>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div>
                <strong>Level:</strong> {course.level || "N/A"}
              </div>
              <div>
                <strong>Language:</strong> {course.language || "N/A"}
              </div>
              <div>
                <strong>Type:</strong> {course.course_type}
              </div>
              <div>
                <strong>Domain:</strong> {course.domain || "General"}
              </div>
            </div>
          </div>
        )}

        {tab === "curriculum" && <CurriculumAccordion courseId={course.id} />}

        {tab === "instructor" && (
          <div>
            <h2 className="text-xl font-semibold mb-3">Instructor</h2>

            <div className="flex items-center gap-4">
              <img
                src={course.instructor_image || "/placeholder.png"}
                className="w-20 h-20 rounded-full object-cover"
                alt=""
              />
              <div>
                <p className="text-lg font-semibold">{course.faculty_name}</p>
                <p className="text-gray-500">
                  Instructor · {course.domain || "General"}
                </p>
              </div>
            </div>
          </div>
        )}

        {tab === "reviews" && (
          <div className="text-gray-500">Reviews coming soon...</div>
        )}
      </div>
    </div>
  );
}
