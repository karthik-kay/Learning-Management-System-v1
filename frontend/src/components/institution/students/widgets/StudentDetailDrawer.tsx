"use client";

import Link from "next/link";
import { ExternalLink, Mail, Phone, UserRound } from "lucide-react";

import { InstitutionStatusBadge } from "@/components/institution/shared/status/InstitutionStatusBadge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useInstitutionSubjectAttendanceReport } from "@/hooks/queries/institution";
import type { InstitutionStudentDetail } from "@/types/institution";

interface StudentDetailDrawerProps {
  open: boolean;
  student?: InstitutionStudentDetail;
  isLoading?: boolean;
  onOpenChange: (open: boolean) => void;
  onSuspend: () => void;
  onPromote: () => void;
}

export function StudentDetailDrawer({
  open,
  student,
  isLoading,
  onOpenChange,
  onSuspend,
  onPromote,
}: StudentDetailDrawerProps) {
  const attendance = useInstitutionSubjectAttendanceReport(
    student?.id ?? Number.NaN,
    open && Boolean(student?.id),
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
        <SheetHeader className="border-b border-slate-200 px-6 py-5">
          <SheetTitle>Student profile</SheetTitle>
          <SheetDescription>
            Academic, contact, and attendance summary.
          </SheetDescription>
        </SheetHeader>

        {isLoading ? (
          <div className="space-y-4 p-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="h-10 animate-pulse rounded bg-slate-100" />
            ))}
          </div>
        ) : student ? (
          <div className="space-y-6 p-6">
            <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-start gap-4">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-[#E7F6F5] text-lg font-semibold text-[#22577A]">
                  <UserRound className="size-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-semibold text-[#0F172A]">
                        {student.name}
                      </h3>
                      <p className="text-sm text-slate-500">
                        {student.enrollment_number}
                      </p>
                    </div>
                    <InstitutionStatusBadge status={student.status} />
                  </div>

                  <div className="mt-4 grid gap-2 text-sm text-slate-600">
                    <span className="inline-flex items-center gap-2">
                      <Mail className="size-4" />
                      {student.email}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <Phone className="size-4" />
                      {student.phone ?? "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <section className="grid gap-3 sm:grid-cols-2">
              <DetailItem label="Department" value={student.department_name} />
              <DetailItem label="Program" value={student.program_name} />
              <DetailItem label="Batch" value={student.batch_name} />
              <DetailItem label="Section" value={student.section_name ?? "N/A"} />
              <DetailItem
                label="Current semester"
                value={String(student.current_semester ?? "N/A")}
              />
              <DetailItem label="Admission date" value={student.admission_date} />
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-[#0F172A]">
                    Subject attendance
                  </h4>
                  <p className="text-sm text-slate-500">
                    Live report from institution attendance APIs.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {attendance.isLoading ? (
                  <div className="h-16 animate-pulse rounded-xl bg-slate-100" />
                ) : attendance.data?.length ? (
                  attendance.data.slice(0, 5).map((item) => (
                    <div
                      key={`${item.subject_code}-${item.subject_name}`}
                      className="rounded-xl bg-slate-50 p-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-[#0F172A]">
                            {item.subject_name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {item.subject_code}
                          </p>
                        </div>
                        <span className="text-sm font-semibold text-[#22577A]">
                          {item.attendance_percentage}%
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">N/A</p>
                )}
              </div>
            </section>

            <div className="grid gap-3 sm:grid-cols-2">
              <Button
                type="button"
                asChild
                className="rounded-xl bg-[#38A3A5] text-white hover:bg-[#22577A] sm:col-span-2"
              >
                <Link
                  href={`/institution/students/${student.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View full profile
                  <ExternalLink className="size-4" />
                </Link>
              </Button>
              <Button
                type="button"
                variant="outline"
                className="rounded-xl"
                onClick={onSuspend}
                disabled={student.status === "suspended"}
              >
                Suspend student
              </Button>
              <Button
                type="button"
                className="rounded-xl bg-[#0F172A] hover:bg-[#22577A]"
                onClick={onPromote}
                disabled={student.status === "graduated"}
              >
                Promote / graduate
              </Button>
            </div>
          </div>
        ) : (
          <p className="p-6 text-sm text-slate-500">Select a student.</p>
        )}
      </SheetContent>
    </Sheet>
  );
}

function DetailItem({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 font-semibold text-[#0F172A]">{value || "N/A"}</p>
    </div>
  );
}
