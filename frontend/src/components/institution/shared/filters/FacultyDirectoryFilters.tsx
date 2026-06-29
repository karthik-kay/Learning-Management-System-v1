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
import type { Department } from "@/types/institution";

export interface FacultyFilterState {
  search: string;
  employee: string;
  department: string;
  status: string;
}

interface FacultyDirectoryFiltersProps {
  filters: FacultyFilterState;
  departments: Department[];
  onChange: (filters: FacultyFilterState) => void;
  onReset: () => void;
}

const statusOptions = [
  { label: "All statuses", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

export function FacultyDirectoryFilters({
  filters,
  departments,
  onChange,
  onReset,
}: FacultyDirectoryFiltersProps) {
  const update = (key: keyof FacultyFilterState, value: string) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-3 md:grid-cols-[minmax(220px,1.2fr)_180px_repeat(2,minmax(160px,1fr))_auto]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={filters.search}
            onChange={(event) => update("search", event.target.value)}
            placeholder="Search faculty"
            className="h-10 rounded-xl border-slate-200 bg-slate-50 pl-9"
          />
        </div>

        <Input
          value={filters.employee}
          onChange={(event) => update("employee", event.target.value)}
          placeholder="Employee ID"
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
