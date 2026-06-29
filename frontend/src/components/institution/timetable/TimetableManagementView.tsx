"use client";

import { AlertTriangle, Plus, Send } from "lucide-react";
import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  useCreateInstitutionTimetableEntry,
  usePublishInstitutionTimetable,
} from "@/hooks/mutations/institution";
import {
  useInstitutionSections,
  useInstitutionTeachingAssignments,
  useInstitutionTimeSlots,
  useInstitutionTimetableConflicts,
  useInstitutionTimetableEntries,
} from "@/hooks/queries/institution";
import type {
  FacultySubjectAssignment,
  Section,
  TimeSlot,
  TimetableEntry,
} from "@/types/institution";

const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

export function TimetableManagementView() {
  const [section, setSection] = useState("all");
  const [faculty, setFaculty] = useState("all");
  const [addOpen, setAddOpen] = useState(false);
  const entriesQuery = useInstitutionTimetableEntries();
  const slotsQuery = useInstitutionTimeSlots();
  const assignmentsQuery = useInstitutionTeachingAssignments();
  const sectionsQuery = useInstitutionSections();
  const conflictsQuery = useInstitutionTimetableConflicts();
  const publish = usePublishInstitutionTimetable();

  const entries = entriesQuery.data?.results ?? [];
  const slots = slotsQuery.data?.results ?? [];
  const assignments = assignmentsQuery.data?.results ?? [];
  const sections = sectionsQuery.data?.results ?? [];
  const conflicts = conflictsQuery.data ?? [];
  const filtered = entries.filter(
    (entry) =>
      (section === "all" || String(entry.section) === section) &&
      (faculty === "all" || entry.faculty_name === faculty),
  );
  const facultyNames = Array.from(new Set(entries.map((entry) => entry.faculty_name))).sort();

  return (
    <main className="space-y-6">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium text-[#E86C0D]">Academic scheduling</p>
          <h1 className="mt-2 text-3xl font-semibold text-[#0F172A]">Timetable</h1>
          <p className="mt-2 text-sm text-slate-600">
            Build weekly schedules, detect faculty and room clashes, then publish by section.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-xl" onClick={() => setAddOpen(true)}>
            <Plus className="size-4" /> Add period
          </Button>
          <Button
            className="rounded-xl bg-[#0F172A]"
            disabled={section === "all" || publish.isPending}
            onClick={() => publish.mutate({ sectionId: Number(section) })}
          >
            <Send className="size-4" /> Publish section
          </Button>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-4">
        <Summary label="Scheduled periods" value={filtered.length} />
        <Summary label="Time slots" value={slots.length} />
        <Summary label="Teaching assignments" value={assignments.length} />
        <Summary label="Conflicts" value={conflicts.length} alert={conflicts.length > 0} />
      </div>

      <section className="grid gap-3 rounded-2xl border bg-white p-4 shadow-sm sm:grid-cols-2">
        <Picker value={section} onChange={setSection} label="All sections">
          {sections.map((item) => (
            <SelectItem key={item.id} value={String(item.id)}>
              {item.batch_name} · Section {item.name}
            </SelectItem>
          ))}
        </Picker>
        <Picker value={faculty} onChange={setFaculty} label="All faculty">
          {facultyNames.map((name) => (
            <SelectItem key={name} value={name}>{name}</SelectItem>
          ))}
        </Picker>
      </section>

      <section className="overflow-x-auto rounded-2xl border bg-white p-4 shadow-sm">
        <div className="grid min-w-[1050px] grid-cols-[120px_repeat(6,minmax(145px,1fr))] gap-2">
          <div />
          {days.map((day) => (
            <div key={day} className="rounded-xl bg-slate-50 p-3 text-center text-sm font-semibold capitalize">
              {day}
            </div>
          ))}
          {slots.filter((slot) => !slot.is_break).map((slot) => (
            <TimetableRow key={slot.id} slot={slot} entries={filtered} />
          ))}
        </div>
      </section>

      {conflicts.length ? (
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <h2 className="flex items-center gap-2 font-semibold text-amber-900">
            <AlertTriangle className="size-5" /> Scheduling conflicts
          </h2>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {conflicts.map((conflict, index) => (
              <div key={index} className="rounded-xl bg-white p-3 text-sm">
                <strong>{conflict.faculty_name}</strong> · {conflict.subject_name}
                <p className="mt-1 text-slate-500">{conflict.details}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <AddPeriodDialog
        open={addOpen}
        sections={sections}
        slots={slots}
        assignments={assignments}
        onOpenChange={setAddOpen}
      />
    </main>
  );
}

function TimetableRow({ slot, entries }: { slot: TimeSlot; entries: TimetableEntry[] }) {
  return (
    <>
      <div className="rounded-xl bg-slate-50 p-3 text-xs font-medium">
        {slot.start_time.slice(0, 5)}–{slot.end_time.slice(0, 5)}
      </div>
      {days.map((day) => {
        const entry = entries.find((item) => item.timeslot === slot.id && item.day.toLowerCase() === day);
        return (
          <div key={day} className="min-h-24 rounded-xl border border-slate-100 p-3">
            {entry ? (
              <>
                <p className="text-sm font-semibold text-[#0F172A]">{entry.subject_name}</p>
                <p className="mt-1 text-xs text-slate-500">{entry.faculty_name}</p>
                <p className="mt-2 text-xs text-[#22577A]">{entry.room || "Room TBA"}</p>
              </>
            ) : <span className="text-xs text-slate-300">Free</span>}
          </div>
        );
      })}
    </>
  );
}

function AddPeriodDialog({ open, sections, slots, assignments, onOpenChange }: { open: boolean; sections: Section[]; slots: TimeSlot[]; assignments: FacultySubjectAssignment[]; onOpenChange: (open: boolean) => void }) {
  const [assignment, setAssignment] = useState("");
  const [section, setSection] = useState("");
  const [slot, setSlot] = useState("");
  const [room, setRoom] = useState("");
  const create = useCreateInstitutionTimetableEntry();
  const submit = (event: FormEvent) => {
    event.preventDefault();
    create.mutate({ assignment: Number(assignment), section: Number(section), timeslot: Number(slot), room }, { onSuccess: () => onOpenChange(false) });
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Add timetable period</DialogTitle><DialogDescription>Assign a teaching allocation to a weekly slot.</DialogDescription></DialogHeader>
        <form className="space-y-4" onSubmit={submit}>
          <Field label="Teaching assignment"><Picker value={assignment} onChange={setAssignment} label="Select assignment" includeAll={false}>{assignments.map((item) => <SelectItem key={item.id} value={String(item.id)}>{item.subject_name} · {item.faculty_name}</SelectItem>)}</Picker></Field>
          <Field label="Section"><Picker value={section} onChange={setSection} label="Select section" includeAll={false}>{sections.map((item) => <SelectItem key={item.id} value={String(item.id)}>{item.batch_name} · {item.name}</SelectItem>)}</Picker></Field>
          <Field label="Time slot"><Picker value={slot} onChange={setSlot} label="Select slot" includeAll={false}>{slots.filter((item) => !item.is_break).map((item) => <SelectItem key={item.id} value={String(item.id)}>{item.day} · {item.start_time.slice(0,5)}</SelectItem>)}</Picker></Field>
          <Field label="Room"><Input value={room} onChange={(event) => setRoom(event.target.value)} /></Field>
          <DialogFooter><Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button><Button type="submit" className="bg-[#0F172A]" disabled={!assignment || !section || !slot || create.isPending}>Create period</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Picker({ value, onChange, label, children, includeAll = true }: { value: string; onChange: (value: string) => void; label: string; children: React.ReactNode; includeAll?: boolean }) {
  return <Select value={value} onValueChange={onChange}><SelectTrigger className="rounded-xl"><SelectValue placeholder={label} /></SelectTrigger><SelectContent>{includeAll ? <SelectItem value="all">{label}</SelectItem> : null}{children}</SelectContent></Select>;
}
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <div className="space-y-2"><Label>{label}</Label>{children}</div>; }
function Summary({ label, value, alert }: { label: string; value: number; alert?: boolean }) { return <div className={`rounded-2xl border bg-white p-4 shadow-sm ${alert ? "border-amber-200" : "border-slate-200"}`}><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-2xl font-semibold">{value}</p></div>; }
