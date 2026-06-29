"use client";

import Link from "next/link";
import { ExternalLink, Mail, Phone, ShieldCheck, UserRound } from "lucide-react";

import { InstitutionStatusBadge } from "@/components/institution/shared/status/InstitutionStatusBadge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { InstitutionFacultyDetail } from "@/types/institution";

interface FacultyDetailDrawerProps {
  open: boolean;
  faculty?: InstitutionFacultyDetail;
  isLoading?: boolean;
  onOpenChange: (open: boolean) => void;
  onSuspend: () => void;
  onReactivate: () => void;
  onOffboard: () => void;
  onMakeHod: () => void;
}

export function FacultyDetailDrawer({
  open,
  faculty,
  isLoading,
  onOpenChange,
  onSuspend,
  onReactivate,
  onOffboard,
  onMakeHod,
}: FacultyDetailDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
        <SheetHeader className="border-b border-slate-200 px-6 py-5">
          <SheetTitle>Faculty preview</SheetTitle>
          <SheetDescription>Profile, department, and lifecycle actions.</SheetDescription>
        </SheetHeader>

        {isLoading ? (
          <div className="space-y-4 p-6">
            {Array.from({ length: 7 }).map((_, index) => (
              <div key={index} className="h-10 animate-pulse rounded bg-slate-100" />
            ))}
          </div>
        ) : faculty ? (
          <div className="space-y-6 p-6">
            <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-start gap-4">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-[#E7F6F5] text-[#22577A]">
                  <UserRound className="size-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-semibold text-[#0F172A]">
                        {faculty.name}
                      </h3>
                      <p className="text-sm text-slate-500">
                        {faculty.employee_id}
                      </p>
                    </div>
                    <InstitutionStatusBadge status={faculty.status} />
                  </div>

                  <div className="mt-4 grid gap-2 text-sm text-slate-600">
                    <span className="inline-flex items-center gap-2">
                      <Mail className="size-4" />
                      {faculty.email}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <Phone className="size-4" />
                      {faculty.phone ?? "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <section className="grid gap-3 sm:grid-cols-2">
              <DetailItem label="Department" value={faculty.department_name} />
              <DetailItem label="Designation" value={faculty.designation} />
              <DetailItem label="Institution" value={faculty.institution_name} />
              <DetailItem label="Joining date" value={faculty.joining_date} />
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-1 size-5 text-[#38A3A5]" />
                <div>
                  <h4 className="font-semibold text-[#0F172A]">HOD assignment</h4>
                  <p className="mt-1 text-sm text-slate-500">
                    Assign this faculty member as HOD for a department.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-4 rounded-xl"
                    onClick={onMakeHod}
                  >
                    Assign as HOD
                  </Button>
                </div>
              </div>
            </section>

            <div className="grid gap-3 sm:grid-cols-2">
              <Button
                asChild
                className="rounded-xl bg-[#38A3A5] text-white hover:bg-[#22577A] sm:col-span-2"
              >
                <Link
                  href={`/institution/faculty/${faculty.id}`}
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
                disabled={faculty.status === "inactive"}
              >
                Suspend
              </Button>
              <Button
                type="button"
                variant="outline"
                className="rounded-xl"
                onClick={onReactivate}
                disabled={faculty.status === "active"}
              >
                Reactivate
              </Button>
              <Button
                type="button"
                variant="destructive"
                className="rounded-xl sm:col-span-2"
                onClick={onOffboard}
              >
                Offboard faculty
              </Button>
            </div>
          </div>
        ) : (
          <p className="p-6 text-sm text-slate-500">Select a faculty member.</p>
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
