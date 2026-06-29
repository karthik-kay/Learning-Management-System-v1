"use client";

import {
  CalendarDays,
  CheckCircle2,
  ExternalLink,
  FileText,
  Search,
  UserRound,
  UsersRound,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { InstitutionStatusBadge } from "@/components/institution/shared/status/InstitutionStatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useDecideInstitutionLeave } from "@/hooks/mutations/institution";
import { useInstitutionLeaveApplications } from "@/hooks/queries/institution";
import type { LeaveApplication } from "@/types/institution";

type ApplicantMode = "student" | "faculty";

export function LeaveManagementView() {
  const [mode, setMode] = useState<ApplicantMode>("student");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [department, setDepartment] = useState("all");
  const [batch, setBatch] = useState("all");
  const [section, setSection] = useState("all");
  const [selected, setSelected] = useState<LeaveApplication | null>(null);

  const leavesQuery = useInstitutionLeaveApplications({ page_size: "100" });
  const leaves = useMemo(
    () => leavesQuery.data?.results ?? [],
    [leavesQuery.data],
  );

  const modeLeaves = useMemo(
    () => leaves.filter((leave) => leave.applicant_type === mode),
    [leaves, mode],
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return modeLeaves.filter((leave) => {
      const matchesSearch =
        !term ||
        leave.applicant_name?.toLowerCase().includes(term) ||
        leave.applicant_identifier?.toLowerCase().includes(term) ||
        leave.reason.toLowerCase().includes(term);
      return (
        matchesSearch &&
        (status === "all" || leave.status === status) &&
        (department === "all" || leave.department_name === department) &&
        (batch === "all" || leave.batch_name === batch) &&
        (section === "all" || leave.section_name === section)
      );
    });
  }, [batch, department, modeLeaves, search, section, status]);

  const pending = modeLeaves.filter((leave) => leave.status === "pending");
  const today = localDateKey(new Date());
  const todayLeaves = leaves.filter(
    (leave) => localDateKey(new Date(leave.created_at)) === today,
  );
  const reviewedToday = leaves.filter(
    (leave) =>
      leave.reviewed_at &&
      localDateKey(new Date(leave.reviewed_at)) === today,
  );
  const chartData = [
    {
      name: "Approved",
      value: leaves.filter((leave) => leave.status === "approved").length,
      color: "#22C55E",
    },
    {
      name: "Rejected",
      value: leaves.filter((leave) => leave.status === "rejected").length,
      color: "#EF4444",
    },
    {
      name: "Pending",
      value: leaves.filter((leave) => leave.status === "pending").length,
      color: "#38A3A5",
    },
  ];

  const departments = unique(leaves.map((leave) => leave.department_name));
  const batches = unique(
    modeLeaves
      .filter(
        (leave) =>
          department === "all" || leave.department_name === department,
      )
      .map((leave) => leave.batch_name),
  );
  const sections = unique(
    modeLeaves
      .filter((leave) => batch === "all" || leave.batch_name === batch)
      .map((leave) => leave.section_name),
  );

  return (
    <main className="space-y-6">
      <section>
        <p className="text-sm font-medium text-[#E86C0D]">Academic operations</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#0F172A]">
          Leave management
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
          Review student and faculty leave, supporting documents, attendance
          impact, decisions, and notification history.
        </p>
      </section>

      <section className="rounded-2xl border border-[#38A3A5]/25 bg-[#E7F6F5]/60 p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-[#22577A]">Quick glance</p>
            <h2 className="mt-1 text-xl font-semibold text-[#0F172A]">
              {pending.length} pending {mode} application
              {pending.length === 1 ? "" : "s"}
            </h2>
          </div>
          <div className="flex gap-2">
            {(["student", "faculty"] as ApplicantMode[]).map((value) => (
              <Button
                key={value}
                variant={mode === value ? "default" : "outline"}
                className={
                  mode === value
                    ? "rounded-xl bg-[#0F172A] capitalize"
                    : "rounded-xl bg-white capitalize"
                }
                onClick={() => {
                  setMode(value);
                  setBatch("all");
                  setSection("all");
                }}
              >
                {value === "student" ? (
                  <UserRound className="size-4" />
                ) : (
                  <UsersRound className="size-4" />
                )}
                {value}
              </Button>
            ))}
          </div>
        </div>
        <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
          {pending.slice(0, 5).map((leave) => (
            <button
              key={leave.id}
              type="button"
              onClick={() => setSelected(leave)}
              className="min-w-60 rounded-xl border border-white bg-white p-3 text-left shadow-sm transition hover:-translate-y-0.5"
            >
              <p className="font-semibold text-[#0F172A]">
                {leave.applicant_name || "Unknown applicant"}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {formatDate(leave.from_date)} – {formatDate(leave.to_date)}
              </p>
            </button>
          ))}
          {!pending.length ? (
            <p className="py-4 text-sm text-[#22577A]">
              No pending {mode} applications.
            </p>
          ) : null}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-5">
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(220px,1fr)_150px_180px_170px_150px_auto]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search applicant or reason"
                  className="h-10 rounded-xl bg-slate-50 pl-9"
                />
              </div>
              <FilterSelect
                value={status}
                onChange={setStatus}
                placeholder="Status"
                options={["pending", "approved", "rejected", "cancelled"]}
              />
              <FilterSelect
                value={department}
                onChange={setDepartment}
                placeholder="Department"
                options={departments}
              />
              <FilterSelect
                value={batch}
                onChange={setBatch}
                placeholder="Batch"
                options={batches}
                disabled={mode === "faculty"}
              />
              <FilterSelect
                value={section}
                onChange={setSection}
                placeholder="Section"
                options={sections}
                disabled={mode === "faculty"}
              />
              <Button
                variant="outline"
                className="h-10 rounded-xl"
                onClick={() => {
                  setSearch("");
                  setStatus("all");
                  setDepartment("all");
                  setBatch("all");
                  setSection("all");
                }}
              >
                Reset
              </Button>
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 hover:bg-slate-50">
                  <TableHead className="px-4">Applicant</TableHead>
                  <TableHead>Leave period</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Attachment</TableHead>
                  <TableHead>Impact</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leavesQuery.isLoading ? (
                  Array.from({ length: 6 }).map((_, index) => (
                    <TableRow key={index}>
                      {Array.from({ length: 6 }).map((__, cell) => (
                        <TableCell key={cell} className="px-4 py-4">
                          <div className="h-4 animate-pulse rounded bg-slate-100" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : filtered.length ? (
                  filtered.map((leave) => (
                    <TableRow
                      key={leave.id}
                      className="cursor-pointer"
                      onClick={() => setSelected(leave)}
                    >
                      <TableCell className="px-4 py-4">
                        <p className="font-semibold text-[#0F172A]">
                          {leave.applicant_name || "Unknown"}
                        </p>
                        <p className="text-xs text-slate-500">
                          {leave.applicant_identifier || "N/A"} ·{" "}
                          {leave.department_name || "No department"}
                        </p>
                      </TableCell>
                      <TableCell>
                        {formatDate(leave.from_date)}
                        <span className="block text-xs text-slate-400">
                          to {formatDate(leave.to_date)}
                        </span>
                      </TableCell>
                      <TableCell>{leaveDays(leave)} days</TableCell>
                      <TableCell>
                        {leave.attachment || leave.document_url ? (
                          <FileText className="size-4 text-[#38A3A5]" />
                        ) : (
                          <span className="text-slate-400">None</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {leave.applicant_type === "student"
                          ? `${leave.affected_sessions} sessions`
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        <InstitutionStatusBadge status={leave.status} />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-40 text-center text-slate-500">
                      No leave applications match these filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </section>
        </div>

        <aside className="space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <StatCard label="Today" value={todayLeaves.length} icon={CalendarDays} />
            <StatCard label="Reviewed" value={reviewedToday.length} icon={CheckCircle2} />
            <StatCard
              label="Approved"
              value={leaves.filter((leave) => leave.status === "approved").length}
              icon={CheckCircle2}
              tone="green"
            />
            <StatCard
              label="Rejected"
              value={leaves.filter((leave) => leave.status === "rejected").length}
              icon={XCircle}
              tone="red"
            />
          </div>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-[#0F172A]">Decision split</h2>
            <p className="mt-1 text-xs text-slate-500">All loaded applications</p>
            <div className="mt-3 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={48}
                    outerRadius={72}
                    paddingAngle={3}
                  >
                    {chartData.map((item) => (
                      <Cell key={item.name} fill={item.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {chartData.map((item) => (
                <div key={item.name} className="flex justify-between text-sm">
                  <span className="flex items-center gap-2 text-slate-600">
                    <span
                      className="size-2 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    {item.name}
                  </span>
                  <strong className="text-[#0F172A]">{item.value}</strong>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>

      <LeaveDrawer
        leave={selected}
        open={Boolean(selected)}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      />
    </main>
  );
}

function LeaveDrawer({
  leave,
  open,
  onOpenChange,
}: {
  leave: LeaveApplication | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [note, setNote] = useState("");
  const decide = useDecideInstitutionLeave();
  if (!leave) return null;

  const decideLeave = (decision: "approved" | "rejected") => {
    decide.mutate(
      { leaveId: leave.id, data: { decision, review_note: note } },
      { onSuccess: () => onOpenChange(false) },
    );
  };
  const document = leave.attachment || leave.document_url;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto sm:max-w-xl">
        <SheetHeader className="border-b border-slate-200 px-6 py-5">
          <SheetTitle>{leave.applicant_name || "Leave application"}</SheetTitle>
          <SheetDescription>
            {leave.applicant_type} · {leave.applicant_identifier || "N/A"}
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-6 px-6">
          <div className="flex items-center justify-between">
            <InstitutionStatusBadge status={leave.status} />
            <span className="text-sm text-slate-500">
              Submitted {formatDate(leave.created_at)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Detail label="Department" value={leave.department_name} />
            <Detail label="Batch" value={leave.batch_name} />
            <Detail label="Section" value={leave.section_name} />
            <Detail label="Duration" value={`${leaveDays(leave)} days`} />
            <Detail label="From" value={formatDate(leave.from_date)} />
            <Detail label="To" value={formatDate(leave.to_date)} />
          </div>

          <section>
            <h3 className="font-semibold text-[#0F172A]">Reason</h3>
            <p className="mt-2 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
              {leave.reason}
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 p-4">
            <h3 className="font-semibold text-[#0F172A]">Supporting document</h3>
            {document ? (
              <Button asChild variant="outline" className="mt-3 rounded-xl">
                <a href={document} target="_blank" rel="noreferrer">
                  <FileText className="size-4" />
                  Open attachment
                  <ExternalLink className="size-3.5" />
                </a>
              </Button>
            ) : (
              <p className="mt-2 text-sm text-slate-500">
                No medical report or supporting document attached.
              </p>
            )}
          </section>

          {leave.applicant_type === "student" ? (
            <section className="rounded-2xl bg-[#E7F6F5] p-4">
              <h3 className="font-semibold text-[#22577A]">Attendance impact</h3>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <Detail
                  label="Affected sessions"
                  value={String(leave.affected_sessions)}
                />
                <Detail
                  label="Recorded absences"
                  value={String(leave.recorded_absences)}
                />
              </div>
            </section>
          ) : null}

          {leave.reviewed_at ? (
            <section>
              <h3 className="font-semibold text-[#0F172A]">Decision history</h3>
              <p className="mt-2 text-sm text-slate-600">
                {leave.reviewed_by_name || "Reviewer"} ·{" "}
                {formatDate(leave.reviewed_at)}
              </p>
              {leave.review_note ? (
                <p className="mt-2 rounded-xl bg-slate-50 p-3 text-sm">
                  {leave.review_note}
                </p>
              ) : null}
            </section>
          ) : null}

          {leave.status === "pending" ? (
            <div className="space-y-2">
              <Label htmlFor="review-note">Review note</Label>
              <Textarea
                id="review-note"
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="Add context for the applicant..."
              />
              <p className="text-xs text-slate-500">
                The applicant receives a notification immediately after your decision.
              </p>
            </div>
          ) : null}
        </div>
        {leave.status === "pending" ? (
          <SheetFooter className="border-t border-slate-200 px-6 py-5">
            <Button
              variant="outline"
              className="border-rose-200 text-rose-700 hover:bg-rose-50"
              disabled={decide.isPending}
              onClick={() => decideLeave("rejected")}
            >
              <XCircle className="size-4" />
              Reject
            </Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700"
              disabled={decide.isPending}
              onClick={() => decideLeave("approved")}
            >
              <CheckCircle2 className="size-4" />
              Approve
            </Button>
          </SheetFooter>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}

function FilterSelect({
  value,
  onChange,
  placeholder,
  options,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  options: string[];
  disabled?: boolean;
}) {
  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className="h-10 rounded-xl bg-slate-50">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All {placeholder.toLowerCase()}</SelectItem>
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {option.replaceAll("_", " ")}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  tone = "teal",
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  tone?: "teal" | "green" | "red";
}) {
  const tones = {
    teal: "bg-[#E7F6F5] text-[#22577A]",
    green: "bg-emerald-50 text-emerald-700",
    red: "bg-rose-50 text-rose-700",
  };
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <Icon className={`size-5 ${tones[tone].split(" ")[1]}`} />
      <p className="mt-3 text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-[#0F172A]">{value}</p>
    </div>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-[#0F172A]">{value || "N/A"}</p>
    </div>
  );
}

function unique(values: Array<string | null>) {
  return Array.from(new Set(values.filter((value): value is string => Boolean(value)))).sort();
}

function leaveDays(leave: LeaveApplication) {
  const start = new Date(`${leave.from_date}T00:00:00`);
  const end = new Date(`${leave.to_date}T00:00:00`);
  return Math.max(1, Math.round((end.getTime() - start.getTime()) / 86400000) + 1);
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function localDateKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}
