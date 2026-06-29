// components/student/assessments/tests/AssessmentList.tsx
"use client";
import { useMemo, useState } from "react";
import { AssessmentFilterBar } from "./AssessmentFilterBar";
import { AssessmentListItem } from "../../../../blocks/assessments/AssessmentListItem";

const MOCK_DATA = [
  {
    id: 1,
    title: "Advanced React Patterns",
    course: "Advanced React",
    module: "React Render Patterns",
    duration: "45 mins",
    questions: 30,
    instructor: "Dr. Sarah",
    level: "Advanced",
  },
  {
    id: 2,
    title: "Python for Data Science",
    course: "Python",
    module: "Python Foundations",
    duration: "30 mins",
    questions: 20,
    instructor: "Prof. Mike",
    level: "Intermediate",
  },
];

export const AssessmentList = () => {
  const [isSortsOpen, setIsSortsOpen] = useState(false);

  const data = useMemo(() => MOCK_DATA, []);

  return (
    <section className="space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900">
          All Assessments
        </h2>
        <p className="text-xs text-slate-500">Choose a test and begin.</p>
      </div>

      {/* Filters */}
      <AssessmentFilterBar
        isSortsOpen={isSortsOpen}
        onToggleSorts={() => setIsSortsOpen(!isSortsOpen)}
      />

      {/* List */}
      <div
        className="
  grid gap-4
  grid-cols-1
  sm:grid-cols-2
  lg:grid-cols-3
  xl:grid-cols-4
"
      >
        {data.map((test) => (
          <AssessmentListItem key={test.id} {...test} />
        ))}
      </div>
    </section>
  );
};
