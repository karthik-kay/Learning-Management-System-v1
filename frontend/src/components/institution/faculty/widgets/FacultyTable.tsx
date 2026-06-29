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
import type { InstitutionFaculty } from "@/types/institution";

import { FacultyRowActions } from "./FacultyRowActions";

interface FacultyTableProps {
  faculty: InstitutionFaculty[];
  isLoading?: boolean;
  onSelect: (faculty: InstitutionFaculty) => void;
  onSuspend: (faculty: InstitutionFaculty) => void;
  onReactivate: (faculty: InstitutionFaculty) => void;
  onOffboard: (faculty: InstitutionFaculty) => void;
  onMakeHod: (faculty: InstitutionFaculty) => void;
}

export function FacultyTable({
  faculty,
  isLoading,
  onSelect,
  onSuspend,
  onReactivate,
  onOffboard,
  onMakeHod,
}: FacultyTableProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 hover:bg-slate-50">
            <TableHead className="px-4">Faculty</TableHead>
            <TableHead>Employee ID</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Designation</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-12 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <TableRow key={index}>
                {Array.from({ length: 6 }).map((__, cellIndex) => (
                  <TableCell key={cellIndex} className="px-4 py-4">
                    <div className="h-4 animate-pulse rounded bg-slate-100" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : faculty.length ? (
            faculty.map((member) => (
              <TableRow
                key={member.id}
                className="cursor-pointer"
                onClick={() => onSelect(member)}
              >
                <TableCell className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-[#E7F6F5] text-sm font-semibold text-[#22577A]">
                      {initials(member.name)}
                    </div>
                    <div>
                      <p className="font-semibold text-[#0F172A]">{member.name}</p>
                      <p className="text-xs text-slate-500">{member.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-medium text-slate-700">
                  {member.employee_id || "N/A"}
                </TableCell>
                <TableCell>{member.department_name || "N/A"}</TableCell>
                <TableCell>{member.designation || "N/A"}</TableCell>
                <TableCell>
                  <InstitutionStatusBadge status={member.status} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <ChevronRight className="size-4 text-slate-300" />
                    <FacultyRowActions
                      faculty={member}
                      onView={onSelect}
                      onSuspend={onSuspend}
                      onReactivate={onReactivate}
                      onOffboard={onOffboard}
                      onMakeHod={onMakeHod}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-40 text-center text-slate-500">
                No faculty found for the selected filters.
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
