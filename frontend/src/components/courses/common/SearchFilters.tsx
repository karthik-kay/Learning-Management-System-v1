"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X, ChevronDown, ListFilter } from "lucide-react";

export interface FilterState {
  searchQuery: string;
  domain: string;
  skillLevel: string;
  language: string;
  priceRange: [number, number];
  courseMode: string;
  courseType: string;
}

interface SearchFiltersProps {
  value: FilterState;
  onChange: (filters: FilterState) => void;
}

const DOMAINS = ["Development", "Design", "Data Science", "AI"];
const LEVELS = ["Beginner", "Intermediate", "Advanced"];
const LANGUAGES = ["English", "Hindi", "Telugu"];
const COURSE_MODES = ["Instructor-Led", "Self-Paced", "Hybrid"];
const COURSE_TYPES = ["Degree", "Workshop", "Certification"];

export function SearchFilters({ value, onChange }: SearchFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const update = (patch: Partial<FilterState>) =>
    onChange({ ...value, ...patch });

  const clearFilters = () =>
    onChange({
      searchQuery: "",
      domain: "",
      skillLevel: "",
      language: "",
      priceRange: [0, 300],
      courseMode: "",
      courseType: "",
    });

  const activeFilterCount = [
    value.domain,
    value.skillLevel,
    value.language,
    value.courseMode,
    value.courseType,
  ].filter(Boolean).length;

  return (
    <div className="flex flex-col gap-4">
      {/* TOP BAR */}
      <div className="flex flex-wrap items-center gap-3">
        {/* SEARCH */}
        <div className="relative flex-1 min-w-60 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            className="pl-9 h-10 rounded-lg"
            placeholder="Search courses"
            value={value.searchQuery}
            onChange={(e) => update({ searchQuery: e.target.value })}
          />
        </div>

        {/* FILTER TOGGLE */}
        <Button
          variant="outline"
          className={`
            h-10 px-4 rounded-lg font-medium text-sm
            ${isOpen ? "bg-orange-50 text-orange-700 border-orange-400" : ""}
          `}
          onClick={() => setIsOpen(!isOpen)}
        >
          <ListFilter className="w-4 h-4 mr-2" />
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-1 text-xs">({activeFilterCount})</span>
          )}
          <ChevronDown
            className={`w-4 h-4 ml-2 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </Button>

        {/* CLEAR */}
        {(activeFilterCount > 0 || value.searchQuery) && (
          <Button
            variant="ghost"
            className="h-10 px-3 text-sm text-muted-foreground hover:text-red-600"
            onClick={clearFilters}
          >
            Clear
            <X className="w-4 h-4 ml-1" />
          </Button>
        )}
      </div>

      {/* ADVANCED FILTERS */}
      {/* ADVANCED FILTERS */}
      <div
        className={`
    transition-all duration-200 overflow-hidden
    ${isOpen ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"}
  `}
      >
        <div
          className="
      mt-3 grid
      grid-cols-[repeat(auto-fit,minmax(150px,1fr))]
      gap-2
    "
        >
          <FilterSelect
            label="Category"
            value={value.domain}
            placeholder="Any category"
            options={DOMAINS}
            onChange={(v) => update({ domain: v })}
          />

          <FilterSelect
            label="Level"
            value={value.skillLevel}
            placeholder="Any level"
            options={LEVELS}
            onChange={(v) => update({ skillLevel: v })}
          />

          <FilterSelect
            label="Language"
            value={value.language}
            placeholder="Any language"
            options={LANGUAGES}
            onChange={(v) => update({ language: v })}
          />

          <FilterSelect
            label="Mode"
            value={value.courseMode}
            placeholder="Any mode"
            options={COURSE_MODES}
            onChange={(v) => update({ courseMode: v })}
          />

          <FilterSelect
            label="Type"
            value={value.courseType}
            placeholder="Any type"
            options={COURSE_TYPES}
            onChange={(v) => update({ courseType: v })}
          />
        </div>
      </div>
    </div>
  );
}

/* ================= SUB COMPONENT ================= */

function FilterSelect({
  label,
  value,
  placeholder,
  options,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <Select
        value={value || "all"}
        onValueChange={(v) => onChange(v === "all" ? "" : v)}
      >
        <SelectTrigger className="h-9 text-sm">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{placeholder}</SelectItem>
          {options.map((o) => (
            <SelectItem key={o} value={o}>
              {o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
