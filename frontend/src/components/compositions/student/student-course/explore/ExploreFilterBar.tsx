"use client";

import { Course } from "@/types/course";

interface ExploreFilterBarProps {
  search: string;
  level: string;
  language: string;
  type: string;
  onSearchChange: (value: string) => void;
  onLevelChange: (value: string) => void;
  onLanguageChange: (value: string) => void;
  onTypeChange: (value: string) => void;
}

export function ExploreFilterBar({
  search,
  level,
  language,
  type,
  onSearchChange,
  onLevelChange,
  onLanguageChange,
  onTypeChange,
}: ExploreFilterBarProps) {
  return (
    <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between mb-6">
      {/* Search */}
      <input
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search courses..."
        className="w-full md:max-w-sm border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-2 text-sm">
        <select
          value={level}
          onChange={(e) => onLevelChange(e.target.value)}
          className="border rounded-lg px-3 py-2 bg-white"
        >
          <option value="">All levels</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>

        <select
          value={language}
          onChange={(e) => onLanguageChange(e.target.value)}
          className="border rounded-lg px-3 py-2 bg-white"
        >
          <option value="">All languages</option>
          <option value="english">English</option>
          <option value="hindi">Hindi</option>
          <option value="telugu">Telugu</option>
          <option value="tamil">Tamil</option>
        </select>

        <select
          value={type}
          onChange={(e) => onTypeChange(e.target.value)}
          className="border rounded-lg px-3 py-2 bg-white"
        >
          <option value="">All types</option>
          <option value="self_paced">Self-paced</option>
          <option value="instructor_led">Instructor-led</option>
        </select>
      </div>
    </div>
  );
}
