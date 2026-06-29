"use client";

import { BellRing, ClipboardCheck } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";

import { InstitutionStatusBadge } from "@/components/institution/shared/status/InstitutionStatusBadge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  useMarkInstitutionBulkAttendance,
  useSendInstitutionBulkShortageAlert,
} from "@/hooks/mutations/institution";
import {
  useInstitutionAttendanceRecords,
  useInstitutionAttendanceSessions,
  useInstitutionAttendanceShortages,
} from "@/hooks/queries/institution";
import type { AttendanceSession } from "@/types/institution";

export function AttendanceManagementView() {
  const [section, setSection] = useState("all");
  const [markOpen, setMarkOpen] = useState(false);
  const sessionsQuery = useInstitutionAttendanceSessions();
  const recordsQuery = useInstitutionAttendanceRecords();
  const shortagesQuery = useInstitutionAttendanceShortages();
  const sendAlerts = useSendInstitutionBulkShortageAlert();

  const sessions = sessionsQuery.data?.results ?? [];
  const records = recordsQuery.data?.results ?? [];
  const shortages = shortagesQuery.data ?? [];
  const sections = Array.from(
    new Set(sessions.map((session) => session.section_name).filter(Boolean)),
  ) as string[];
  const filteredSessions = sessions.filter(
    (session) => section === "all" || session.section_name === section,
  );
  const present = records.filter((record) => record.status === "present").length;
  const absent = records.filter((record) => record.status === "absent").length;
  const rate = records.length ? (present / records.length) * 100 : 0;

  return (
    <main className="space-y-6">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium text-[#E86C0D]">Academic operations</p>
          <h1 className="mt-2 text-3xl font-semibold text-[#0F172A]">Attendance</h1>
          <p className="mt-2 text-sm text-slate-600">
            Review sessions, mark student attendance, track shortages, and send alerts.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-xl" onClick={() => sendAlerts.mutate({})}>
            <BellRing className="size-4" /> Send shortage alerts
          </Button>
          <Button className="rounded-xl bg-[#0F172A]" onClick={() => setMarkOpen(true)}>
            <ClipboardCheck className="size-4" /> Mark attendance
          </Button>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Summary label="Sessions" value={sessions.length} />
        <Summary label="Attendance rate" value={`${rate.toFixed(1)}%`} />
        <Summary label="Absent records" value={absent} />
        <Summary label="Shortage students" value={shortages.length} alert={shortages.length > 0} />
      </div>

      <section className="max-w-xs">
        <Select value={section} onValueChange={setSection}>
          <SelectTrigger className="rounded-xl bg-white"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All sections</SelectItem>
            {sections.map((name) => <SelectItem key={name} value={name}>{name}</SelectItem>)}
          </SelectContent>
        </Select>
      </section>

      <Tabs defaultValue="sessions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="records">Records</TabsTrigger>
          <TabsTrigger value="shortages">Shortage list</TabsTrigger>
        </TabsList>
        <TabsContent value="sessions">
          <DataTable headers={["Date", "Section", "Subject", "Faculty", "Topic", "Status"]}>
            {filteredSessions.map((session) => (
              <TableRow key={session.id}>
                <TableCell>{formatDate(session.date)}</TableCell>
                <TableCell>{session.section_name || "N/A"}</TableCell>
                <TableCell>{session.subject_name || "N/A"}</TableCell>
                <TableCell>{session.faculty_name || "N/A"}</TableCell>
                <TableCell>{session.topic || "Not recorded"}</TableCell>
                <TableCell><InstitutionStatusBadge status={session.is_cancelled ? "cancelled" : "completed"} /></TableCell>
              </TableRow>
            ))}
          </DataTable>
        </TabsContent>
        <TabsContent value="records">
          <DataTable headers={["Student", "Enrollment", "Session", "Status", "Remarks"]}>
            {records.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{record.student_name || "N/A"}</TableCell>
                <TableCell>{record.enrollment_number || "N/A"}</TableCell>
                <TableCell>#{record.session}</TableCell>
                <TableCell><InstitutionStatusBadge status={record.status} /></TableCell>
                <TableCell>{record.remarks || "—"}</TableCell>
              </TableRow>
            ))}
          </DataTable>
        </TabsContent>
        <TabsContent value="shortages">
          <DataTable headers={["Student", "Enrollment", "Department", "Attended", "Percentage", "Shortage"]}>
            {shortages.map((item, index) => (
              <TableRow key={`${item.enrollment_number}-${index}`}>
                <TableCell className="font-semibold">{item.student_name}</TableCell>
                <TableCell>{item.enrollment_number}</TableCell>
                <TableCell>{item.department}</TableCell>
                <TableCell>{item.attended}/{item.total_classes}</TableCell>
                <TableCell>{item.attendance_percentage}%</TableCell>
                <TableCell className="font-semibold text-rose-600">{item.shortage}%</TableCell>
              </TableRow>
            ))}
          </DataTable>
        </TabsContent>
      </Tabs>

      <MarkAttendanceDialog open={markOpen} sessions={sessions} onOpenChange={setMarkOpen} />
    </main>
  );
}

function MarkAttendanceDialog({ open, sessions, onOpenChange }: { open: boolean; sessions: AttendanceSession[]; onOpenChange: (open: boolean) => void }) {
  const [session, setSession] = useState("");
  const [rows, setRows] = useState("");
  const mark = useMarkInstitutionBulkAttendance();
  const parsed = useMemo(() => rows.split(/\r?\n/).filter(Boolean).map((row) => {
    const [student, status, ...remarks] = row.split(",").map((cell) => cell.trim());
    return { student: Number(student), status, remarks: remarks.join(", ") };
  }).filter((row) => Number.isInteger(row.student) && ["present", "absent", "late"].includes(row.status)), [rows]);
  const submit = (event: FormEvent) => {
    event.preventDefault();
    mark.mutate({ session: Number(session), records: parsed }, { onSuccess: () => onOpenChange(false) });
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader><DialogTitle>Mark attendance</DialogTitle><DialogDescription>Choose a session and paste: student ID, present/absent/late, remarks.</DialogDescription></DialogHeader>
        <form className="space-y-4" onSubmit={submit}>
          <Select value={session} onValueChange={setSession}><SelectTrigger><SelectValue placeholder="Select session" /></SelectTrigger><SelectContent>{sessions.map((item) => <SelectItem key={item.id} value={String(item.id)}>{formatDate(item.date)} · {item.section_name} · {item.subject_name}</SelectItem>)}</SelectContent></Select>
          <Textarea rows={8} value={rows} onChange={(event) => setRows(event.target.value)} placeholder={"101, present,\n102, absent, Medical leave\n103, late, 10 minutes"} className="font-mono text-sm" />
          <DialogFooter><Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button><Button type="submit" className="bg-[#0F172A]" disabled={!session || !parsed.length || mark.isPending}>Mark {parsed.length} records</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DataTable({ headers, children }: { headers: string[]; children: React.ReactNode }) {
  return <section className="overflow-hidden rounded-2xl border bg-white shadow-sm"><Table><TableHeader><TableRow className="bg-slate-50 hover:bg-slate-50">{headers.map((header) => <TableHead key={header}>{header}</TableHead>)}</TableRow></TableHeader><TableBody>{children}</TableBody></Table></section>;
}
function Summary({ label, value, alert }: { label: string; value: string | number; alert?: boolean }) { return <div className={`rounded-2xl border bg-white p-4 shadow-sm ${alert ? "border-rose-200" : "border-slate-200"}`}><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-2xl font-semibold text-[#0F172A]">{value}</p></div>; }
function formatDate(value: string) { return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(`${value}T00:00:00`)); }
