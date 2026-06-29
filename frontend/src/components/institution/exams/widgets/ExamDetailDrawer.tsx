"use client";

import { BookOpen, CalendarDays, Trophy } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { Exam, ExamResult, ExamSubject } from "@/types/institution";

interface ExamDetailDrawerProps {
  open: boolean;
  exam?: Exam | null;
  subjects: ExamSubject[];
  results: ExamResult[];
  onOpenChange: (open: boolean) => void;
}

export function ExamDetailDrawer({
  open,
  exam,
  subjects,
  results,
  onOpenChange,
}: ExamDetailDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
        <SheetHeader className="border-b border-slate-200 px-6 py-5">
          <SheetTitle>Exam preview</SheetTitle>
          <SheetDescription>Schedule, subjects, and result summary.</SheetDescription>
        </SheetHeader>

        {exam ? (
          <div className="space-y-6 p-6">
            <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-start gap-4">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-[#E7F6F5] text-[#22577A]">
                  <CalendarDays className="size-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#0F172A]">{exam.name}</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {exam.batch_name || exam.batch} · {exam.exam_type}
                  </p>
                </div>
              </div>
            </section>

            <section className="grid gap-3 sm:grid-cols-3">
              <Metric label="Subjects" value={subjects.length} />
              <Metric label="Results" value={results.length} />
              <Metric label="Status" value={exam.is_published ? "Published" : "Draft"} />
            </section>

            <AssociationSection
              title="Exam subjects"
              icon={<BookOpen className="size-4" />}
              emptyText="No subjects mapped to this exam."
            >
              {subjects.map((subject) => (
                <AssociationRow
                  key={subject.id}
                  title={subject.subject_name}
                  meta={subject.exam_name}
                  value={subject.max_marks ? `${subject.max_marks} marks` : "N/A"}
                />
              ))}
            </AssociationSection>

            <AssociationSection
              title="Recent results"
              icon={<Trophy className="size-4" />}
              emptyText="No results recorded yet."
            >
              {results.slice(0, 8).map((result) => (
                <AssociationRow
                  key={result.id}
                  title={result.student_name}
                  meta={result.enrollment_number}
                  value={result.is_absent ? "Absent" : String(result.marks_obtained)}
                />
              ))}
            </AssociationSection>
          </div>
        ) : (
          <p className="p-6 text-sm text-slate-500">Select an exam.</p>
        )}
      </SheetContent>
    </Sheet>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-xl font-semibold text-[#0F172A]">{value}</p>
    </div>
  );
}

function AssociationSection({
  title,
  icon,
  emptyText,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  emptyText: string;
  children: React.ReactNode[];
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-[#38A3A5]">{icon}</span>
        <h4 className="font-semibold text-[#0F172A]">{title}</h4>
      </div>
      <div className="space-y-3">
        {children.length ? (
          children
        ) : (
          <p className="rounded-xl border border-dashed border-slate-200 bg-white p-4 text-sm text-slate-500">
            {emptyText}
          </p>
        )}
      </div>
    </section>
  );
}

function AssociationRow({
  title,
  meta,
  value,
}: {
  title: string;
  meta: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4">
      <div>
        <p className="font-semibold text-[#0F172A]">{title}</p>
        <p className="mt-1 text-xs text-slate-500">{meta}</p>
      </div>
      <span className="rounded-full bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600">
        {value}
      </span>
    </div>
  );
}
