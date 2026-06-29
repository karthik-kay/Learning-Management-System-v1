"use client";

import { Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AcademicBatch, Department, Section } from "@/types/institution";

export interface StudentFilterState {
  search: string;
  enrollment: string;
  department: string;
  batch: string;
  section: string;
  status: string;
}

interface StudentDirectoryFiltersProps {
  filters: StudentFilterState;
  departments: Department[];
  batches: AcademicBatch[];
  sections: Section[];
  onChange: (filters: StudentFilterState) => void;
  onReset: () => void;
}

const statusOptions = [
  { label: "All statuses", value: "all" },
  { label: "Active", value: "active" },
  { label: "Suspended", value: "suspended" },
  { label: "Graduated", value: "graduated" },
  { label: "On leave", value: "on_leave" },
];

export function StudentDirectoryFilters({
  filters,
  departments,
  batches,
  sections,
  onChange,
  onReset,
}: StudentDirectoryFiltersProps) {
  const update = (key: keyof StudentFilterState, value: string) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-3 md:grid-cols-[minmax(220px,1.2fr)_180px_repeat(4,minmax(150px,1fr))_auto]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={filters.search}
            onChange={(event) => update("search", event.target.value)}
            placeholder="Search student"
            className="h-10 rounded-xl border-slate-200 bg-slate-50 pl-9"
          />
        </div>

        <Input
          value={filters.enrollment}
          onChange={(event) => update("enrollment", event.target.value)}
          placeholder="Student ID"
          className="h-10 rounded-xl border-slate-200 bg-slate-50"
        />

        <FilterSelect
          value={filters.department}
          placeholder="Department"
          onValueChange={(value) => update("department", value)}
          items={[
            { label: "All departments", value: "all" },
            ...departments.map((department) => ({
              label: department.name,
              value: String(department.id),
            })),
          ]}
        />

        <FilterSelect
          value={filters.batch}
          placeholder="Batch"
          onValueChange={(value) => update("batch", value)}
          items={[
            { label: "All batches", value: "all" },
            ...batches.map((batch) => ({
              label: batch.name,
              value: String(batch.id),
            })),
          ]}
        />

        <FilterSelect
          value={filters.section}
          placeholder="Section"
          onValueChange={(value) => update("section", value)}
          items={[
            { label: "All sections", value: "all" },
            ...sections.map((section) => ({
              label: section.name,
              value: String(section.id),
            })),
          ]}
        />

        <FilterSelect
          value={filters.status}
          placeholder="Status"
          onValueChange={(value) => update("status", value)}
          items={statusOptions}
        />

        <Button
          type="button"
          variant="outline"
          className="h-10 rounded-xl"
          onClick={onReset}
        >
          <X className="size-4" />
        </Button>
      </div>
    </section>
  );
}

function FilterSelect({
  value,
  placeholder,
  items,
  onValueChange,
}: {
  value: string;
  placeholder: string;
  items: Array<{ label: string; value: string }>;
  onValueChange: (value: string) => void;
}) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="h-10 w-full rounded-xl border-slate-200 bg-slate-50">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {items.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

