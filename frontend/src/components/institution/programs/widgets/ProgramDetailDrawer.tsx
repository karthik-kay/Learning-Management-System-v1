"use client";

import { BookOpen, GraduationCap, Layers3, UsersRound } from "lucide-react";

import { InstitutionStatusBadge } from "@/components/institution/shared/status/InstitutionStatusBadge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { AcademicBatch, Program, Section, Subject } from "@/types/institution";

interface ProgramDetailDrawerProps {
  open: boolean;
  program?: Program | null;
  batches: AcademicBatch[];
  sections: Section[];
  subjects: Subject[];
  onOpenChange: (open: boolean) => void;
}

export function ProgramDetailDrawer({
  open,
  program,
  batches,
  sections,
  subjects,
  onOpenChange,
}: ProgramDetailDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
        <SheetHeader className="border-b border-slate-200 px-6 py-5">
          <SheetTitle>Program preview</SheetTitle>
          <SheetDescription>
            Program ownership, academic structure, subjects, and batches.
          </SheetDescription>
        </SheetHeader>

        {program ? (
          <div className="space-y-6 p-6">
            <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-start gap-4">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-[#E7F6F5] text-[#22577A]">
                  <GraduationCap className="size-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-semibold text-[#0F172A]">
                        {program.name}
                      </h3>
                      <p className="text-sm text-slate-500">{program.code}</p>
                    </div>
                    <InstitutionStatusBadge
                      status={program.is_active ? "active" : "inactive"}
                    />
                  </div>
                  <p className="mt-4 text-sm leading-6 text-slate-600">
                    {program.department_name} · {program.degree_name}
                  </p>
                </div>
              </div>
            </section>

            <section className="grid gap-3 sm:grid-cols-2">
              <DetailItem label="Department" value={program.department_name} />
              <DetailItem label="Degree" value={program.degree_name} />
              <DetailItem
                label="Duration"
                value={`${program.duration_semesters} semesters`}
              />
              <DetailItem
                label="Intake capacity"
                value={String(program.intake_capacity ?? "N/A")}
              />
            </section>

            <section className="grid gap-3 sm:grid-cols-3">
              <Metric
                label="Batches"
                value={batches.length}
                icon={<Layers3 className="size-4" />}
              />
              <Metric
                label="Subjects"
                value={subjects.length}
                icon={<BookOpen className="size-4" />}
              />
              <Metric
                label="Sections"
                value={sections.length}
                icon={<UsersRound className="size-4" />}
              />
            </section>

            <AssociationSection
              title="Batches mapped"
              icon={<Layers3 className="size-4" />}
              emptyText="No batches mapped to this program."
            >
              {batches.map((batch) => (
                <AssociationRow
                  key={batch.id}
                  title={batch.name}
                  meta={`${batch.start_year}-${batch.end_year} · Semester ${batch.current_semester ?? "N/A"}`}
                  value={batch.status}
                />
              ))}
            </AssociationSection>

            <AssociationSection
              title="Sections"
              icon={<UsersRound className="size-4" />}
              emptyText="No sections mapped to this program's batches."
            >
              {sections.map((section) => (
                <AssociationRow
                  key={section.id}
                  title={`Section ${section.name}`}
                  meta={section.batch_name}
                  value={section.class_teacher_name || "N/A"}
                />
              ))}
            </AssociationSection>

            <AssociationSection
              title="Subjects"
              icon={<BookOpen className="size-4" />}
              emptyText="No subjects mapped to this program."
            >
              {subjects.map((subject) => (
                <AssociationRow
                  key={subject.id}
                  title={subject.name}
                  meta={`${subject.code} · ${subject.subject_type}`}
                  value={`Sem ${subject.semester}`}
                />
              ))}
            </AssociationSection>
          </div>
        ) : (
          <p className="p-6 text-sm text-slate-500">Select a program.</p>
        )}
      </SheetContent>
    </Sheet>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 font-semibold text-[#0F172A]">{value}</p>
    </div>
  );
}

function Metric({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="text-[#38A3A5]">{icon}</div>
      <p className="mt-3 text-sm text-slate-500">{label}</p>
      <p className="text-2xl font-semibold text-[#0F172A]">{value}</p>
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
      <div className="min-w-0">
        <p className="font-semibold text-[#0F172A]">{title}</p>
        <p className="mt-1 text-xs text-slate-500">{meta}</p>
      </div>
      <span className="shrink-0 rounded-full bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600">
        {value}
      </span>
    </div>
  );
}
