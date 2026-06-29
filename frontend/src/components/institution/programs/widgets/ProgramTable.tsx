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
import type { Program } from "@/types/institution";

interface ProgramTableProps {
  programs: Program[];
  isLoading?: boolean;
  onSelect: (program: Program) => void;
}

export function ProgramTable({ programs, isLoading, onSelect }: ProgramTableProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 hover:bg-slate-50">
            <TableHead className="px-4">Program</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Degree</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Intake</TableHead>
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
          ) : programs.length ? (
            programs.map((program) => (
              <TableRow
                key={program.id}
                className="cursor-pointer"
                onClick={() => onSelect(program)}
              >
                <TableCell className="px-4 py-4">
                  <Link
                    href={`/institution/programs/${program.id}`}
                    className="block hover:text-[#E86C0D]"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <p className="font-semibold text-[#0F172A]">{program.name}</p>
                    <p className="text-xs text-slate-500">{program.code}</p>
                  </Link>
                </TableCell>
                <TableCell>{program.department_name || "N/A"}</TableCell>
                <TableCell>{program.degree_name || "N/A"}</TableCell>
                <TableCell>{program.duration_semesters} semesters</TableCell>
                <TableCell>{program.intake_capacity ?? "N/A"}</TableCell>
                <TableCell>
                  <InstitutionStatusBadge
                    status={program.is_active ? "active" : "inactive"}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <Button asChild variant="ghost" size="icon" className="size-8">
                    <Link
                      href={`/institution/programs/${program.id}`}
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
                No programs found for the selected filters.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </section>
  );
}
