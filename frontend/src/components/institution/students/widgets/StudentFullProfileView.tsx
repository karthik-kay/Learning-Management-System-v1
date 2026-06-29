"use client";

import Link from "next/link";
import {
  ArrowLeft,
  BookOpenCheck,
  CalendarDays,
  GraduationCap,
  Mail,
  Phone,
  UserRound,
} from "lucide-react";

import { InstitutionStatusBadge } from "@/components/institution/shared/status/InstitutionStatusBadge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  useInstitutionStudent,
  useInstitutionStudentProgressReport,
  useInstitutionSubjectAttendanceReport,
} from "@/hooks/queries/institution";

interface StudentFullProfileViewProps {
  studentId: number;
}

export function StudentFullProfileView({ studentId }: StudentFullProfileViewProps) {
  const studentQuery = useInstitutionStudent(studentId);
  const attendanceQuery = useInstitutionSubjectAttendanceReport(studentId);
  const progressQuery = useInstitutionStudentProgressReport(studentId);

  const student = studentQuery.data;
  const progress = progressQuery.data;
  const attendanceRows = attendanceQuery.data ?? [];

  if (studentQuery.isLoading) {
    return (
      <main className="space-y-6">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="h-32 animate-pulse rounded-2xl bg-slate-100" />
        ))}
      </main>
    );
  }

  if (!student) {
    return (
      <main className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <h1 className="text-xl font-semibold text-[#0F172A]">Student not found</h1>
        <p className="mt-2 text-sm text-slate-500">
          This profile may be outside your institution scope.
        </p>
        <Button asChild className="mt-5 rounded-xl bg-[#0F172A]">
          <Link href="/institution/students">Back to students</Link>
        </Button>
      </main>
    );
  }

  const overallAttendance =
    progress?.overall_attendance ??
    average(attendanceRows.map((row) => row.attendance_percentage));

  return (
    <main className="space-y-6">
      <Button asChild variant="ghost" className="rounded-xl px-0 text-slate-600">
        <Link href="/institution/students">
          <ArrowLeft className="size-4" />
          Back to students
        </Link>
      </Button>

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="bg-[#0F172A] px-6 py-7 text-white lg:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-white/10">
                <UserRound className="size-8 text-[#57CC99]" />
              </div>
              <div>
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <InstitutionStatusBadge status={student.status} />
                  <span className="rounded-full bg-white/10 px-3 py-1 text-sm text-slate-200">
                    {student.enrollment_number || "N/A"}
                  </span>
                </div>
                <h1 className="text-3xl font-semibold tracking-tight">
                  {student.name}
                </h1>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
                  {student.program_name || "N/A"} · {student.batch_name || "N/A"} ·{" "}
                  {student.section_name || "N/A"}
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[420px]">
              <HeroStat label="Attendance" value={formatPercent(overallAttendance)} />
              <HeroStat label="CGPA" value={formatValue(progress?.cgpa)} />
              <HeroStat label="Semester" value={formatValue(student.current_semester)} />
            </div>
          </div>
        </div>

        <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="space-y-5 p-6 lg:p-8">
            <div>
              <h2 className="text-lg font-semibold text-[#0F172A]">
                Student overview
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Profile, academic placement, and contact information from the
                institution people APIs.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <InfoTile label="Department" value={student.department_name} />
              <InfoTile label="Program" value={student.program_name} />
              <InfoTile label="Batch" value={student.batch_name} />
              <InfoTile label="Section" value={student.section_name} />
              <InfoTile
                label="Enrolled"
                value={student.admission_date}
                icon={<CalendarDays className="size-4" />}
              />
              <InfoTile
                label="Current semester"
                value={formatValue(student.current_semester)}
                icon={<GraduationCap className="size-4" />}
              />
            </div>
          </section>

          <aside className="border-t border-slate-200 bg-slate-50 p-6 lg:border-l lg:border-t-0 lg:p-8">
            <h2 className="text-lg font-semibold text-[#0F172A]">Contact</h2>
            <div className="mt-4 space-y-3">
              <ContactRow icon={<Mail className="size-4" />} value={student.email} />
              <ContactRow
                icon={<Phone className="size-4" />}
                value={student.phone || "N/A"}
              />
            </div>

            <Separator className="my-6" />

            <h3 className="font-semibold text-[#0F172A]">Quick admin actions</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <Button variant="outline" className="rounded-xl bg-white">
                Suspend student
              </Button>
              <Button className="rounded-xl bg-[#0F172A] hover:bg-[#22577A]">
                Promote / graduate
              </Button>
            </div>
          </aside>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-[#0F172A]">
                Subject attendance
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Per-subject attendance report for this student.
              </p>
            </div>
            <BookOpenCheck className="size-5 text-[#38A3A5]" />
          </div>

          <div className="mt-5 space-y-4">
            {attendanceQuery.isLoading ? (
              <div className="h-24 animate-pulse rounded-xl bg-slate-100" />
            ) : attendanceRows.length ? (
              attendanceRows.map((item) => (
                <div key={`${item.subject_code}-${item.subject_name}`}>
                  <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                    <div>
                      <p className="font-semibold text-[#0F172A]">
                        {item.subject_name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {item.subject_code} · {item.attended}/{item.total_classes}{" "}
                        classes
                      </p>
                    </div>
                    <span className="font-semibold text-[#22577A]">
                      {item.attendance_percentage}%
                    </span>
                  </div>
                  <Progress
                    value={item.attendance_percentage}
                    className="h-2 bg-slate-100 [&_[data-slot=progress-indicator]]:bg-[#38A3A5]"
                  />
                </div>
              ))
            ) : (
              <EmptyState text="N/A - no subject attendance report available yet." />
            )}
          </div>
        </div>

        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#0F172A]">
              Academic progress
            </h2>
            <div className="mt-5 grid gap-3">
              <InfoTile label="Overall attendance" value={formatPercent(overallAttendance)} />
              <InfoTile label="CGPA" value={formatValue(progress?.cgpa)} />
              <InfoTile label="Grade" value={progress?.subjects?.length ? "Available" : "N/A"} />
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#0F172A]">
              Previous tests
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Exam and assessment history will render here once the tests report API
              is wired.
            </p>
            <div className="mt-5">
              <EmptyState text="N/A - no previous tests endpoint connected." />
            </div>
          </section>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[#0F172A]">Subjects snapshot</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {progress?.subjects?.length ? (
            progress.subjects.map((subject, index) => (
              <div key={index} className="rounded-xl bg-slate-50 p-4">
                <p className="font-semibold text-[#0F172A]">
                  {String(subject.name ?? subject.subject_name ?? "Subject")}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {String(subject.code ?? subject.subject_code ?? "N/A")}
                </p>
              </div>
            ))
          ) : (
            <EmptyState text="N/A - no subject progress rows available." />
          )}
        </div>
      </section>
    </main>
  );
}

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-xs text-slate-300">{label}</p>
      <p className="mt-1 text-xl font-semibold text-white">{value}</p>
    </div>
  );
}

function InfoTile({
  label,
  value,
  icon,
}: {
  label: string;
  value?: string | number | null;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-2 text-xs text-slate-500">
        {icon}
        <span>{label}</span>
      </div>
      <p className="mt-1 font-semibold text-[#0F172A]">{formatValue(value)}</p>
    </div>
  );
}

function ContactRow({ icon, value }: { icon: React.ReactNode; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-white p-3 text-sm text-slate-700">
      <span className="text-[#22577A]">{icon}</span>
      <span>{value}</span>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm text-slate-500">
      {text}
    </div>
  );
}

function average(values: number[]) {
  if (!values.length) return null;
  return values.reduce((total, value) => total + value, 0) / values.length;
}

function formatPercent(value?: number | null) {
  if (typeof value !== "number" || Number.isNaN(value)) return "N/A";
  return `${Math.round(value)}%`;
}

function formatValue(value?: string | number | null) {
  if (value === undefined || value === null || value === "") return "N/A";
  return String(value);
}
