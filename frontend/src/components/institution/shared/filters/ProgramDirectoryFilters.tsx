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

export interface ProgramFilterState {
  search: string;
  department: string;
  status: string;
}

interface ProgramDirectoryFiltersProps {
  filters: ProgramFilterState;
  departments: Department[];
  onChange: (filters: ProgramFilterState) => void;
  onReset: () => void;
}

export function ProgramDirectoryFilters({
  filters,
  departments,
  onChange,
  onReset,
}: ProgramDirectoryFiltersProps) {
  const update = (key: keyof ProgramFilterState, value: string) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-3 md:grid-cols-[minmax(240px,1fr)_minmax(180px,0.6fr)_160px_auto]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={filters.search}
            onChange={(event) => update("search", event.target.value)}
            placeholder="Search programs"
            className="h-10 rounded-xl border-slate-200 bg-slate-50 pl-9"
          />
        </div>

        <Select
          value={filters.department}
          onValueChange={(value) => update("department", value)}
        >
          <SelectTrigger className="h-10 rounded-xl border-slate-200 bg-slate-50">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All departments</SelectItem>
            {departments.map((department) => (
              <SelectItem key={department.id} value={department.name}>
                {department.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.status} onValueChange={(value) => update("status", value)}>
          <SelectTrigger className="h-10 rounded-xl border-slate-200 bg-slate-50">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

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
