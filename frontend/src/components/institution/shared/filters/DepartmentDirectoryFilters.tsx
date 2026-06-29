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

export interface DepartmentFilterState {
  search: string;
  status: string;
}

interface DepartmentDirectoryFiltersProps {
  filters: DepartmentFilterState;
  onChange: (filters: DepartmentFilterState) => void;
  onReset: () => void;
}

export function DepartmentDirectoryFilters({
  filters,
  onChange,
  onReset,
}: DepartmentDirectoryFiltersProps) {
  const update = (key: keyof DepartmentFilterState, value: string) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-3 md:grid-cols-[minmax(240px,1fr)_180px_auto]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={filters.search}
            onChange={(event) => update("search", event.target.value)}
            placeholder="Search departments"
            className="h-10 rounded-xl border-slate-200 bg-slate-50 pl-9"
          />
        </div>

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
