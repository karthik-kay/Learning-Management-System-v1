"use client";

import { ChevronRight } from "lucide-react";

import { InstitutionStatusBadge } from "@/components/institution/shared/status/InstitutionStatusBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { InstitutionStudent } from "@/types/institution";

import { StudentRowActions } from "./StudentRowActions";

interface StudentTableProps {
  students: InstitutionStudent[];
  isLoading?: boolean;
  onSelect: (student: InstitutionStudent) => void;
  onSuspend: (student: InstitutionStudent) => void;
  onPromote: (student: InstitutionStudent) => void;
}

export function StudentTable({
  students,
  isLoading,
  onSelect,
  onSuspend,
  onPromote,
}: StudentTableProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 hover:bg-slate-50">
            <TableHead className="px-4">Student</TableHead>
            <TableHead>Student ID</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Program</TableHead>
            <TableHead>Batch</TableHead>
            <TableHead>Section</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-12 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <TableRow key={index}>
                {Array.from({ length: 8 }).map((__, cellIndex) => (
                  <TableCell key={cellIndex} className="px-4 py-4">
                    <div className="h-4 animate-pulse rounded bg-slate-100" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : students.length ? (
            students.map((student) => (
              <TableRow
                key={student.id}
                className="cursor-pointer"
                onClick={() => onSelect(student)}
              >
                <TableCell className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-[#E7F6F5] text-sm font-semibold text-[#22577A]">
                      {initials(student.name)}
                    </div>
                    <div>
                      <p className="font-semibold text-[#0F172A]">{student.name}</p>
                      <p className="text-xs text-slate-500">{student.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-medium text-slate-700">
                  {student.enrollment_number || "N/A"}
                </TableCell>
                <TableCell>{student.department_name || "N/A"}</TableCell>
                <TableCell>{student.program_name || "N/A"}</TableCell>
                <TableCell>{student.batch_name || "N/A"}</TableCell>
                <TableCell>{student.section_name || "N/A"}</TableCell>
                <TableCell>
                  <InstitutionStatusBadge status={student.status} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <ChevronRight className="size-4 text-slate-300" />
                    <StudentRowActions
                      student={student}
                      onView={onSelect}
                      onSuspend={onSuspend}
                      onPromote={onPromote}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="h-40 text-center text-slate-500">
                No students found for the selected filters.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </section>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

