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

export interface AssessmentFilterState {
  search: string;
  type: string;
  mode: string;
}

interface AssessmentDirectoryFiltersProps {
  filters: AssessmentFilterState;
  onChange: (filters: AssessmentFilterState) => void;
  onReset: () => void;
}

export function AssessmentDirectoryFilters({
  filters,
  onChange,
  onReset,
}: AssessmentDirectoryFiltersProps) {
  const update = (key: keyof AssessmentFilterState, value: string) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-3 md:grid-cols-[minmax(240px,1fr)_180px_160px_auto]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={filters.search}
            onChange={(event) => update("search", event.target.value)}
            placeholder="Search assessments"
            className="h-10 rounded-xl border-slate-200 bg-slate-50 pl-9"
          />
        </div>
        <Select value={filters.type} onValueChange={(value) => update("type", value)}>
          <SelectTrigger className="h-10 rounded-xl border-slate-200 bg-slate-50">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="quiz">Quiz</SelectItem>
            <SelectItem value="assignment">Assignment</SelectItem>
            <SelectItem value="internal">Internal</SelectItem>
            <SelectItem value="project">Project</SelectItem>
            <SelectItem value="lab">Lab</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filters.mode} onValueChange={(value) => update("mode", value)}>
          <SelectTrigger className="h-10 rounded-xl border-slate-200 bg-slate-50">
            <SelectValue placeholder="Mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All modes</SelectItem>
            <SelectItem value="internal">Internal</SelectItem>
            <SelectItem value="external">External</SelectItem>
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
