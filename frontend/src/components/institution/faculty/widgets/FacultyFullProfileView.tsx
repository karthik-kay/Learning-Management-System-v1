"use client";

import Link from "next/link";
import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  Mail,
  Phone,
  UserRound,
} from "lucide-react";

import { InstitutionStatusBadge } from "@/components/institution/shared/status/InstitutionStatusBadge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  useInstitutionFacultyActivityReport,
  useInstitutionFacultyDetail,
} from "@/hooks/queries/institution";
import type {
  FacultyActivityReport,
  PaginatedResponse,
} from "@/types/institution";
import { useEffect } from "react";

interface FacultyFullProfileViewProps {
  facultyId: number;
}

export function FacultyFullProfileView({
  facultyId,
}: FacultyFullProfileViewProps) {
  const facultyQuery = useInstitutionFacultyDetail(facultyId);
  const activityQuery = useInstitutionFacultyActivityReport();

  const faculty = facultyQuery.data;
  const activityRows = normalizeActivityRows(activityQuery.data);
  const activity = activityRows.find(
    (row) =>
      row.employee_id === faculty?.employee_id ||
      row.faculty_name.toLowerCase() === faculty?.name.toLowerCase(),
  );

  if (facultyQuery.isLoading) {
    return (
      <main className="space-y-6">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="h-32 animate-pulse rounded-2xl bg-slate-100"
          />
        ))}
      </main>
    );
  }

  if (!faculty) {
    return (
      <main className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <h1 className="text-xl font-semibold text-[#0F172A]">
          Faculty not found
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          This profile may be outside your institution scope.
        </p>
        <Button asChild className="mt-5 rounded-xl bg-[#0F172A]">
          <Link href="/institution/faculty">Back to faculty</Link>
        </Button>
      </main>
    );
  }

  return (
    <main className="space-y-6">
      <Button
        asChild
        variant="ghost"
        className="rounded-xl px-0 text-slate-600"
      >
        <Link href="/institution/faculty">
          <ArrowLeft className="size-4" />
          Back to faculty
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
                  <InstitutionStatusBadge status={faculty.status} />
                  <span className="rounded-full bg-white/10 px-3 py-1 text-sm text-slate-200">
                    {faculty.employee_id || "N/A"}
                  </span>
                </div>
                <h1 className="text-3xl font-semibold tracking-tight">
                  {faculty.name}
                </h1>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
                  {faculty.designation || "N/A"} ·{" "}
                  {faculty.department_name || "N/A"}
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[420px]">
              <HeroStat
                label="Classes"
                value={formatValue(activity?.classes_conducted)}
              />
              <HeroStat
                label="Subjects"
                value={formatValue(activity?.subjects_assigned)}
              />
              <HeroStat
                label="Attendance logs"
                value={formatValue(activity?.attendance_submissions)}
              />
            </div>
          </div>
        </div>

        <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="space-y-5 p-6 lg:p-8">
            <div>
              <h2 className="text-lg font-semibold text-[#0F172A]">
                Faculty overview
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Profile, department placement, and lifecycle metadata.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <InfoTile label="Department" value={faculty.department_name} />
              <InfoTile label="Designation" value={faculty.designation} />
              <InfoTile label="Institution" value={faculty.institution_name} />
              <InfoTile
                label="Joining date"
                value={faculty.joining_date}
                icon={<CalendarDays className="size-4" />}
              />
              <InfoTile
                label="Employee ID"
                value={faculty.employee_id}
                icon={<BriefcaseBusiness className="size-4" />}
              />
              <InfoTile label="Account status" value={faculty.status} />
            </div>
          </section>

          <aside className="border-t border-slate-200 bg-slate-50 p-6 lg:border-l lg:border-t-0 lg:p-8">
            <h2 className="text-lg font-semibold text-[#0F172A]">Contact</h2>
            <div className="mt-4 space-y-3">
              <ContactRow
                icon={<Mail className="size-4" />}
                value={faculty.email}
              />
              <ContactRow
                icon={<Phone className="size-4" />}
                value={faculty.phone || "N/A"}
              />
            </div>

            <Separator className="my-6" />

            <h3 className="font-semibold text-[#0F172A]">
              Quick admin actions
            </h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <Button variant="outline" className="rounded-xl bg-white">
                Suspend
              </Button>
              <Button className="rounded-xl bg-[#0F172A] hover:bg-[#22577A]">
                Assign as HOD
              </Button>
            </div>
          </aside>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <ActivityTile
          label="Classes scheduled"
          value={formatValue(activity?.classes_scheduled)}
        />
        <ActivityTile
          label="Classes conducted"
          value={formatValue(activity?.classes_conducted)}
        />
        <ActivityTile
          label="Attendance submissions"
          value={formatValue(activity?.attendance_submissions)}
        />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[#0F172A]">
          Teaching workload
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Subject assignments and workload rows can render here once the
          teaching-assignment endpoint is connected per faculty.
        </p>
        <div className="mt-5 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm text-slate-500">
          N/A - no per-faculty subject assignment feed connected yet.
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

function ActivityTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-[#0F172A]">{value}</p>
    </div>
  );
}

function formatValue(value?: string | number | null) {
  if (value === undefined || value === null || value === "") return "N/A";
  return String(value);
}

function normalizeActivityRows(
  data?: FacultyActivityReport[] | PaginatedResponse<FacultyActivityReport>,
) {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  return data.results ?? [];
}
