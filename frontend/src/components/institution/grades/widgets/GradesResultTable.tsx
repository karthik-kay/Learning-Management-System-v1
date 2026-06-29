"use client";

import { LockKeyhole } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type {
  EvaluationComponent,
  ExamResult,
  SubjectResult,
} from "@/types/institution";

interface SubjectResultsTableProps {
  rows: SubjectResult[];
  isLoading?: boolean;
}

export function SubjectResultsTable({
  rows,
  isLoading,
}: SubjectResultsTableProps) {
  return (
    <TableShell>
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 hover:bg-slate-50">
            <TableHead className="px-4">Student</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead className="text-right">Internal</TableHead>
            <TableHead className="text-right">External</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead>Grade</TableHead>
            <TableHead className="text-right">Grade point</TableHead>
            <TableHead className="w-16 text-right">Override</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <LoadingRows columns={8} />
          ) : rows.length ? (
            rows.map((result) => (
              <TableRow key={result.id}>
                <TableCell className="px-4 py-4">
                  <p className="font-semibold text-[#0F172A]">
                    {result.student_name || "Unnamed student"}
                  </p>
                  <p className="text-xs text-slate-500">
                    {result.enrollment_number || `Student #${result.student}`}
                  </p>
                </TableCell>
                <TableCell>
                  <p className="font-medium text-slate-700">
                    {result.subject_name || `Subject #${result.subject}`}
                  </p>
                  <p className="text-xs text-slate-500">
                    {result.credits ?? 0} credits
                  </p>
                </TableCell>
                <TableCell className="text-right">
                  {formatMark(result.internal_marks)}
                </TableCell>
                <TableCell className="text-right">
                  {formatMark(result.external_marks)}
                </TableCell>
                <TableCell className="text-right font-semibold text-[#0F172A]">
                  {formatMark(result.total_marks)}
                </TableCell>
                <TableCell>
                  <GradeBadge grade={result.grade} />
                </TableCell>
                <TableCell className="text-right">
                  {formatMark(result.grade_point)}
                </TableCell>
                <TableCell className="text-right">
                  <span
                    title="Manual grade override is planned for a later release"
                    className="inline-flex size-8 items-center justify-center rounded-lg text-slate-300"
                  >
                    <LockKeyhole className="size-4" />
                  </span>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <EmptyRow columns={8} message="No subject results match these filters." />
          )}
        </TableBody>
      </Table>
    </TableShell>
  );
}

interface ExamScoresTableProps {
  rows: ExamResult[];
  isLoading?: boolean;
}

export function ExamScoresTable({ rows, isLoading }: ExamScoresTableProps) {
  return (
    <TableShell>
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 hover:bg-slate-50">
            <TableHead className="px-4">Student</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead className="text-right">Marks</TableHead>
            <TableHead className="text-right">Maximum</TableHead>
            <TableHead className="text-right">Percentage</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <LoadingRows columns={6} />
          ) : rows.length ? (
            rows.map((result) => {
              const percentage =
                result.max_marks && !result.is_absent
                  ? (result.marks_obtained / result.max_marks) * 100
                  : 0;

              return (
                <TableRow key={result.id}>
                  <TableCell className="px-4 py-4">
                    <p className="font-semibold text-[#0F172A]">
                      {result.student_name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {result.enrollment_number}
                    </p>
                  </TableCell>
                  <TableCell>{result.subject_name || "Not assigned"}</TableCell>
                  <TableCell className="text-right">
                    {result.is_absent ? "—" : formatMark(result.marks_obtained)}
                  </TableCell>
                  <TableCell className="text-right">
                    {result.max_marks ?? "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    {result.is_absent ? "—" : `${percentage.toFixed(1)}%`}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        result.is_absent
                          ? "rounded-full border-rose-200 bg-rose-50 text-rose-700"
                          : "rounded-full border-emerald-200 bg-emerald-50 text-emerald-700"
                      }
                    >
                      {result.is_absent ? "Absent" : "Recorded"}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <EmptyRow columns={6} message="No exam scores match these filters." />
          )}
        </TableBody>
      </Table>
    </TableShell>
  );
}

interface ComponentsTableProps {
  rows: EvaluationComponent[];
  isLoading?: boolean;
}

export function ComponentsTable({ rows, isLoading }: ComponentsTableProps) {
  return (
    <TableShell>
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 hover:bg-slate-50">
            <TableHead className="px-4">Component</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Batch</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Maximum</TableHead>
            <TableHead className="text-right">Weightage</TableHead>
            <TableHead>Mode</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <LoadingRows columns={7} />
          ) : rows.length ? (
            rows.map((component) => (
              <TableRow key={component.id}>
                <TableCell className="px-4 py-4">
                  <p className="font-semibold text-[#0F172A]">{component.name}</p>
                  <p className="text-xs text-slate-500">#{component.id}</p>
                </TableCell>
                <TableCell>{component.subject_name}</TableCell>
                <TableCell>{component.batch_name}</TableCell>
                <TableCell className="capitalize">
                  {component.component_type.replaceAll("_", " ")}
                </TableCell>
                <TableCell className="text-right">{component.max_marks}</TableCell>
                <TableCell className="text-right">{component.weightage}%</TableCell>
                <TableCell>
                  <Badge variant="outline" className="rounded-full">
                    {component.is_internal ? "Internal" : "External"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <EmptyRow columns={7} message="No evaluation components found." />
          )}
        </TableBody>
      </Table>
    </TableShell>
  );
}

function TableShell({ children }: { children: React.ReactNode }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {children}
    </section>
  );
}

function LoadingRows({ columns }: { columns: number }) {
  return Array.from({ length: 5 }).map((_, index) => (
    <TableRow key={index}>
      {Array.from({ length: columns }).map((__, cellIndex) => (
        <TableCell key={cellIndex} className="px-4 py-4">
          <div className="h-4 animate-pulse rounded bg-slate-100" />
        </TableCell>
      ))}
    </TableRow>
  ));
}

function EmptyRow({
  columns,
  message,
}: {
  columns: number;
  message: string;
}) {
  return (
    <TableRow>
      <TableCell colSpan={columns} className="h-40 text-center text-slate-500">
        {message}
      </TableCell>
    </TableRow>
  );
}

function GradeBadge({ grade }: { grade: string | null | undefined }) {
  const value = grade || "—";
  const failed = value.toUpperCase() === "F";

  return (
    <Badge
      variant="outline"
      className={
        failed
          ? "min-w-10 justify-center rounded-full border-rose-200 bg-rose-50 text-rose-700"
          : "min-w-10 justify-center rounded-full border-emerald-200 bg-emerald-50 text-emerald-700"
      }
    >
      {value}
    </Badge>
  );
}

function formatMark(value: number | null | undefined) {
  return Number.isFinite(value) ? Number(value).toFixed(1) : "—";
}
