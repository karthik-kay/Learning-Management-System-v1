"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { InstitutionStatusBadge } from "@/components/institution/shared/status/InstitutionStatusBadge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Department } from "@/types/institution";

interface DepartmentTableProps {
  departments: Department[];
  isLoading?: boolean;
  onSelect: (department: Department) => void;
}

export function DepartmentTable({
  departments,
  isLoading,
  onSelect,
}: DepartmentTableProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 hover:bg-slate-50">
            <TableHead className="px-4">Department</TableHead>
            <TableHead>HOD</TableHead>
            <TableHead>Programs</TableHead>
            <TableHead>Faculty</TableHead>
            <TableHead>Students</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-12 text-right">Open</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                {Array.from({ length: 7 }).map((__, cellIndex) => (
                  <TableCell key={cellIndex} className="px-4 py-4">
                    <div className="h-4 animate-pulse rounded bg-slate-100" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : departments.length ? (
            departments.map((department) => (
              <TableRow
                key={department.id}
                className="cursor-pointer"
                onClick={() => onSelect(department)}
              >
                <TableCell className="px-4 py-4">
                  <Link
                    href={`/institution/departments/${department.id}`}
                    className="block hover:text-[#E86C0D]"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <p className="font-semibold text-[#0F172A]">
                      {department.name}
                    </p>
                    <p className="text-xs text-slate-500">{department.code}</p>
                  </Link>
                </TableCell>
                <TableCell>{department.hod_name || "N/A"}</TableCell>
                <TableCell>{department.program_count ?? 0}</TableCell>
                <TableCell>{department.faculty_count ?? 0}</TableCell>
                <TableCell>{department.student_count ?? 0}</TableCell>
                <TableCell>
                  <InstitutionStatusBadge
                    status={department.is_active ? "active" : "inactive"}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <Button asChild variant="ghost" size="icon" className="size-8">
                    <Link
                      href={`/institution/departments/${department.id}`}
                      onClick={(event) => event.stopPropagation()}
                    >
                      <ChevronRight className="size-4 text-slate-400" />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="h-40 text-center text-slate-500">
                No departments found for the selected filters.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </section>
  );
}
