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

export interface ExamFilterState {
  search: string;
  type: string;
  publish: string;
}

interface ExamDirectoryFiltersProps {
  filters: ExamFilterState;
  onChange: (filters: ExamFilterState) => void;
  onReset: () => void;
}

export function ExamDirectoryFilters({
  filters,
  onChange,
  onReset,
}: ExamDirectoryFiltersProps) {
  const update = (key: keyof ExamFilterState, value: string) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-3 md:grid-cols-[minmax(240px,1fr)_180px_180px_auto]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={filters.search}
            onChange={(event) => update("search", event.target.value)}
            placeholder="Search exams"
            className="h-10 rounded-xl border-slate-200 bg-slate-50 pl-9"
          />
        </div>
        <Select value={filters.type} onValueChange={(value) => update("type", value)}>
          <SelectTrigger className="h-10 rounded-xl border-slate-200 bg-slate-50">
            <SelectValue placeholder="Exam type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="midterm">Midterm</SelectItem>
            <SelectItem value="final">Final</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={filters.publish}
          onValueChange={(value) => update("publish", value)}
        >
          <SelectTrigger className="h-10 rounded-xl border-slate-200 bg-slate-50">
            <SelectValue placeholder="Publish status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
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
