// components/student/assessments/tests/AssessmentFilterBar.tsx
"use client";
import { ListFilter, ChevronDown } from "lucide-react";

interface Props {
  isSortsOpen: boolean;
  onToggleSorts: () => void;
}

export const AssessmentFilterBar = ({ isSortsOpen, onToggleSorts }: Props) => {
  return (
    <div className="flex flex-wrap items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3">
      {/* Filters */}
      <button
        onClick={onToggleSorts}
        className="
          flex items-center gap-2
          text-sm font-medium
          text-slate-700
          hover:text-slate-900
        "
      >
        <ListFilter size={16} />
        Filters
      </button>

      <div className="h-5 w-px bg-slate-200" />
      <div className="flex flex-1 px-4 items-center gap-8">
        {" "}
        <FilterSelect label="Skill Level" />
        <FilterSelect label="Category" />
        <FilterSelect label="Mode" />
      </div>
    </div>
  );
};

const FilterSelect = ({ label }: { label: string }) => (
  <button className="flex  items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900">
    <span className="leading-none flex items-center">{label}</span>
    <ChevronDown size={14} className="  leading-none" />
  </button>
);
