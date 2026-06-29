"use client";

import { ChevronRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { EvaluationComponent } from "@/types/institution";

interface AssessmentTableProps {
  components: EvaluationComponent[];
  isLoading?: boolean;
  onSelect: (component: EvaluationComponent) => void;
}

export function AssessmentTable({
  components,
  isLoading,
  onSelect,
}: AssessmentTableProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 hover:bg-slate-50">
            <TableHead className="px-4">Assessment</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Batch</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Marks</TableHead>
            <TableHead>Weightage</TableHead>
            <TableHead>Mode</TableHead>
            <TableHead className="w-12 text-right">Open</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                {Array.from({ length: 8 }).map((__, cellIndex) => (
                  <TableCell key={cellIndex} className="px-4 py-4">
                    <div className="h-4 animate-pulse rounded bg-slate-100" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : components.length ? (
            components.map((component) => (
              <TableRow
                key={component.id}
                className="cursor-pointer"
                onClick={() => onSelect(component)}
              >
                <TableCell className="px-4 py-4">
                  <p className="font-semibold text-[#0F172A]">{component.name}</p>
                  <p className="text-xs text-slate-500">
                    Semester {component.semester ?? "N/A"}
                  </p>
                </TableCell>
                <TableCell>{component.subject_name || "N/A"}</TableCell>
                <TableCell>{component.batch_name || "N/A"}</TableCell>
                <TableCell>{component.component_type}</TableCell>
                <TableCell>{component.max_marks}</TableCell>
                <TableCell>{component.weightage}%</TableCell>
                <TableCell>
                  <Badge variant="outline" className="rounded-full">
                    {component.is_internal ? "Internal" : "External"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="size-8">
                    <ChevronRight className="size-4 text-slate-400" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="h-40 text-center text-slate-500">
                No assessments found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </section>
  );
}
