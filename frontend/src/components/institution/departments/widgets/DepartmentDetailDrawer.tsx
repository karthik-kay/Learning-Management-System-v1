"use client";

import {
  BookOpen,
  Building2,
  GraduationCap,
  Layers3,
  UsersRound,
} from "lucide-react";

import { InstitutionStatusBadge } from "@/components/institution/shared/status/InstitutionStatusBadge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type {
  AcademicBatch,
  Department,
  InstitutionFaculty,
  Program,
  Section,
  Subject,
} from "@/types/institution";

interface DepartmentDetailDrawerProps {
  open: boolean;
  department?: Department | null;
  programs: Program[];
  faculty: InstitutionFaculty[];
  subjects: Subject[];
  batches: AcademicBatch[];
  sections: Section[];
  onOpenChange: (open: boolean) => void;
}

export function DepartmentDetailDrawer({
  open,
  department,
  programs,
  faculty,
  subjects,
  batches,
  sections,
  onOpenChange,
}: DepartmentDetailDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
        <SheetHeader className="border-b border-slate-200 px-6 py-5">
          <SheetTitle>Department preview</SheetTitle>
          <SheetDescription>
            Department ownership, status, and operational summary.
          </SheetDescription>
        </SheetHeader>

        {department ? (
          <div className="space-y-6 p-6">
            <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-start gap-4">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-[#E7F6F5] text-[#22577A]">
                  <Building2 className="size-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-semibold text-[#0F172A]">
                        {department.name}
                      </h3>
                      <p className="text-sm text-slate-500">{department.code}</p>
                    </div>
                    <InstitutionStatusBadge
                      status={department.is_active ? "active" : "inactive"}
                    />
                  </div>
                  <p className="mt-4 text-sm leading-6 text-slate-600">
                    {department.description || "N/A"}
                  </p>
                </div>
              </div>
            </section>

            <section className="grid gap-3 sm:grid-cols-2">
              <DetailItem label="HOD" value={department.hod_name || "N/A"} />
              <DetailItem label="Created" value={department.created_at || "N/A"} />
            </section>

            <section className="grid gap-3 sm:grid-cols-3">
              <Metric
                label="Programs"
                value={department.program_count ?? 0}
                icon={<GraduationCap className="size-4" />}
              />
              <Metric
                label="Faculty"
                value={department.faculty_count ?? 0}
                icon={<UsersRound className="size-4" />}
              />
              <Metric
                label="Students"
                value={department.student_count ?? 0}
                icon={<UsersRound className="size-4" />}
              />
            </section>

            <AssociationSection
              title="Programs mapped"
              icon={<GraduationCap className="size-4" />}
              emptyText="No programs mapped to this department."
            >
              {programs.map((program) => (
                <AssociationRow
                  key={program.id}
                  title={program.name}
                  meta={`${program.degree_name} · ${program.duration_semesters} semesters`}
                  value={program.intake_capacity ? `Intake ${program.intake_capacity}` : "N/A"}
                />
              ))}
            </AssociationSection>

            <AssociationSection
              title="Faculty associated"
              icon={<UsersRound className="size-4" />}
              emptyText="No faculty mapped to this department."
            >
              {faculty.map((member) => (
                <AssociationRow
                  key={member.id}
                  title={member.name}
                  meta={`${member.employee_id} · ${member.designation || "N/A"}`}
                  value={member.status}
                />
              ))}
            </AssociationSection>

            <AssociationSection
              title="Subjects offered"
              icon={<BookOpen className="size-4" />}
              emptyText="No subjects mapped to this department's programs."
            >
              {subjects.map((subject) => (
                <AssociationRow
                  key={subject.id}
                  title={subject.name}
                  meta={`${subject.code} · ${subject.program_name}`}
                  value={`Sem ${subject.semester}`}
                />
              ))}
            </AssociationSection>

            <AssociationSection
              title="Batches and sections"
              icon={<Layers3 className="size-4" />}
              emptyText="No batches mapped to this department's programs."
            >
              {batches.map((batch) => {
                const batchSections = sections.filter(
                  (section) => section.batch_name === batch.name,
                );

                return (
                  <div
                    key={batch.id}
                    className="rounded-xl border border-slate-200 bg-white p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-[#0F172A]">{batch.name}</p>
                        <p className="text-xs text-slate-500">
                          {batch.program_name} · {batch.start_year}-{batch.end_year}
                        </p>
                      </div>
                      <span className="rounded-full bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600">
                        {batch.status}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {batchSections.length ? (
                        batchSections.map((section) => (
                          <span
                            key={section.id}
                            className="rounded-full bg-[#E7F6F5] px-2.5 py-1 text-xs font-medium text-[#22577A]"
                          >
                            Section {section.name}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400">No sections</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </AssociationSection>
          </div>
        ) : (
          <p className="p-6 text-sm text-slate-500">Select a department.</p>
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
