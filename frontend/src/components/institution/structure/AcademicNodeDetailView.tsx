"use client";

import {
  ArrowLeft,
  BookOpen,
  Building2,
  CalendarDays,
  GraduationCap,
  Layers3,
  UserRoundCheck,
  UsersRound,
} from "lucide-react";
import Link from "next/link";

import { InstitutionStatusBadge } from "@/components/institution/shared/status/InstitutionStatusBadge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useInstitutionBatches,
  useInstitutionBatch,
  useInstitutionDepartment,
  useInstitutionDepartments,
  useInstitutionProgram,
  useInstitutionPrograms,
  useInstitutionSection,
  useInstitutionSections,
  useInstitutionStudents,
  useInstitutionSubjects,
} from "@/hooks/queries/institution";
import type {
  AcademicBatch,
  Department,
  Program,
  Section,
} from "@/types/institution";

type NodeKind = "department" | "program" | "batch" | "section";

interface AcademicNodeDetailViewProps {
  kind: NodeKind;
  id: number;
}

export function AcademicNodeDetailView({
  kind,
  id,
}: AcademicNodeDetailViewProps) {
  const departmentQuery = useInstitutionDepartment(id, kind === "department");
  const programQuery = useInstitutionProgram(id, kind === "program");
  const batchQuery = useInstitutionBatch(id, kind === "batch");
  const sectionQuery = useInstitutionSection(id, kind === "section");

  const departmentsQuery = useInstitutionDepartments();
  const programsQuery = useInstitutionPrograms();
  const batchesQuery = useInstitutionBatches();
  const sectionsQuery = useInstitutionSections();
  const subjectsQuery = useInstitutionSubjects();
  const studentsQuery = useInstitutionStudents(
    kind === "section"
      ? { section: String(id), page_size: "100" }
      : kind === "batch"
        ? { batch: String(id), page_size: "100" }
        : { page_size: "1" },
  );

  const departments = departmentsQuery.data?.results ?? [];
  const programs = programsQuery.data?.results ?? [];
  const batches = batchesQuery.data?.results ?? [];
  const sections = sectionsQuery.data?.results ?? [];
  const subjects = subjectsQuery.data?.results ?? [];
  const students = studentsQuery.data?.results ?? [];

  const department =
    kind === "department"
      ? departmentQuery.data
      : resolveDepartment(
          kind,
          programQuery.data,
          batchQuery.data,
          sectionQuery.data,
          departments,
          programs,
          batches,
        );
  const program =
    kind === "program"
      ? programQuery.data
      : resolveProgram(kind, batchQuery.data, sectionQuery.data, programs, batches);
  const batch =
    kind === "batch"
      ? batchQuery.data
      : kind === "section"
        ? resolveBatch(sectionQuery.data, batches)
        : undefined;
  const section = kind === "section" ? sectionQuery.data : undefined;

  const loading =
    departmentsQuery.isLoading ||
    programsQuery.isLoading ||
    batchesQuery.isLoading ||
    sectionsQuery.isLoading ||
    (kind === "department" && departmentQuery.isLoading) ||
    (kind === "program" && programQuery.isLoading) ||
    (kind === "batch" && batchQuery.isLoading) ||
    (kind === "section" && sectionQuery.isLoading);

  const current = departmentQuery.data || programQuery.data || batchQuery.data || sectionQuery.data;

  if (loading) {
    return (
      <main className="space-y-5">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-32 animate-pulse rounded-2xl bg-slate-100" />
        ))}
      </main>
    );
  }

  if (!current) {
    return (
      <main className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <h1 className="text-xl font-semibold text-[#0F172A]">
          Academic record not found
        </h1>
        <Button asChild className="mt-5 bg-[#0F172A]">
          <Link href={`/institution/${plural(kind)}`}>Back to {plural(kind)}</Link>
        </Button>
      </main>
    );
  }

  const childPrograms = department
    ? programs.filter(
        (item) =>
          item.department === department.id ||
          item.department_name === department.name,
      )
    : [];
  const childBatches = program
    ? batches.filter(
        (item) =>
          item.program === program.id || item.program_name === program.name,
      )
    : department
      ? batches.filter((item) =>
          childPrograms.some(
            (child) =>
              item.program === child.id || item.program_name === child.name,
          ),
        )
      : [];
  const childSections = batch
    ? sections.filter(
        (item) => item.batch === batch.id || item.batch_name === batch.name,
      )
    : sections.filter((item) =>
        childBatches.some(
          (child) => item.batch === child.id || item.batch_name === child.name,
        ),
      );
  const childSubjects = program
    ? subjects.filter((item) => item.program_name === program.name)
    : [];

  const title =
    kind === "section" ? `Section ${section?.name}` : current.name;
  const subtitle = buildSubtitle(kind, department, program, batch, section);
  const backHref = `/institution/${plural(kind)}`;

  return (
    <main className="space-y-6">
      <Button asChild variant="ghost" className="rounded-xl px-0 text-slate-600">
        <Link href={backHref}>
          <ArrowLeft className="size-4" />
          Back to {plural(kind)}
        </Link>
      </Button>

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="bg-[#0F172A] px-6 py-7 text-white lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-start gap-4">
              <span className="flex size-16 items-center justify-center rounded-2xl bg-white/10">
                <NodeIcon kind={kind} />
              </span>
              <div>
                <div className="mb-3 flex flex-wrap gap-2">
                  <InstitutionStatusBadge status={nodeStatus(kind, current)} />
                  <span className="rounded-full bg-white/10 px-3 py-1 text-sm text-slate-200">
                    {nodeCode(kind, current)}
                  </span>
                </div>
                <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
                <p className="mt-2 text-sm text-slate-300">{subtitle}</p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <HeroStat
                label="Students"
                value={
                  kind === "department"
                    ? department?.student_count ?? 0
                    : kind === "section" || kind === "batch"
                      ? studentsQuery.data?.count ?? students.length
                      : 0
                }
              />
              <HeroStat
                label={kind === "section" ? "Capacity" : "Children"}
                value={
                  kind === "section"
                    ? section?.capacity ?? "N/A"
                    : kind === "department"
                      ? childPrograms.length
                      : kind === "program"
                        ? childBatches.length
                        : childSections.length
                }
              />
              <HeroStat
                label={kind === "section" ? "Semester" : "HOD"}
                value={
                  kind === "section"
                    ? batch?.current_semester ?? "N/A"
                    : department?.hod_name || "Unassigned"
                }
              />
            </div>
          </div>
        </div>

        <div className="p-6 lg:p-8">
          <h2 className="text-lg font-semibold text-[#0F172A]">Academic path</h2>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
            {department ? (
              <PathLink
                href={`/institution/departments/${department.id}`}
                label={department.name}
              />
            ) : null}
            {program ? (
              <PathLink
                href={`/institution/programs/${program.id}`}
                label={program.name}
              />
            ) : null}
            {batch ? (
              <PathLink
                href={`/institution/batches/${batch.id}`}
                label={batch.name}
              />
            ) : null}
            {section ? (
              <PathLink
                href={`/institution/sections/${section.id}`}
                label={`Section ${section.name}`}
              />
            ) : null}
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <InfoTile label="Department" value={department?.name} />
            <InfoTile label="HOD" value={department?.hod_name} />
            <InfoTile label="Program" value={program?.name} />
            <InfoTile label="Batch" value={batch?.name} />
            {section ? (
              <>
                <InfoTile label="Class teacher" value={section.class_teacher_name} />
                <InfoTile label="Capacity" value={section.capacity} />
              </>
            ) : null}
            {batch ? (
              <>
                <InfoTile
                  label="Academic years"
                  value={`${batch.start_year}–${batch.end_year}`}
                />
                <InfoTile label="Current semester" value={batch.current_semester} />
              </>
            ) : null}
          </div>
        </div>
      </section>

      {kind === "section" || kind === "batch" ? (
        <RosterSection
          title={kind === "section" ? "Section students" : "Batch students"}
          students={students}
          capacity={section?.capacity ?? batch?.intake_size}
          isLoading={studentsQuery.isLoading}
        />
      ) : (
        <ChildStructure
          kind={kind}
          programs={childPrograms}
          batches={childBatches}
          sections={childSections}
          subjects={childSubjects}
        />
      )}

      {kind === "section" ? (
        <section className="grid gap-4 md:grid-cols-3">
          <QuickLink
            href="/institution/timetable"
            title="Timetable"
            text="Open the weekly class schedule."
            icon={CalendarDays}
          />
          <QuickLink
            href="/institution/attendance"
            title="Attendance"
            text="Review sessions and shortage alerts."
            icon={UserRoundCheck}
          />
          <QuickLink
            href="/institution/grades"
            title="Grades"
            text="Review marks and published results."
            icon={BookOpen}
          />
        </section>
      ) : null}
    </main>
  );
}

function RosterSection({
  title,
  students,
  capacity,
  isLoading,
}: {
  title: string;
  students: Array<{
    id: number;
    name: string;
    enrollment_number: string;
    current_semester: number;
    status: string;
  }>;
  capacity?: number;
  isLoading: boolean;
}) {
  const fill = capacity ? Math.min(100, (students.length / capacity) * 100) : 0;
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[#0F172A]">{title}</h2>
          <p className="mt-1 text-sm text-slate-500">
            Click a student name to open their complete institution profile.
          </p>
        </div>
        {capacity ? (
          <div className="w-full max-w-56">
            <div className="mb-2 flex justify-between text-xs text-slate-500">
              <span>Seats filled</span>
              <span>
                {students.length}/{capacity}
              </span>
            </div>
            <Progress value={fill} className="h-2" />
          </div>
        ) : null}
      </div>
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 hover:bg-slate-50">
            <TableHead className="px-4">Student</TableHead>
            <TableHead>Enrollment</TableHead>
            <TableHead>Semester</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-12 text-right">Profile</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <TableRow key={index}>
                {Array.from({ length: 5 }).map((__, cell) => (
                  <TableCell key={cell} className="px-4 py-4">
                    <div className="h-4 animate-pulse rounded bg-slate-100" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : students.length ? (
            students.map((student) => (
              <TableRow key={student.id}>
                <TableCell className="px-4 py-4">
                  <Link
                    href={`/institution/students/${student.id}`}
                    className="font-semibold text-[#0F172A] hover:text-[#E86C0D]"
                  >
                    {student.name}
                  </Link>
                </TableCell>
                <TableCell>{student.enrollment_number}</TableCell>
                <TableCell>{student.current_semester}</TableCell>
                <TableCell>
                  <InstitutionStatusBadge status={student.status} />
                </TableCell>
                <TableCell className="text-right">
                  <Button asChild variant="ghost" size="icon" className="size-8">
                    <Link href={`/institution/students/${student.id}`}>→</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-36 text-center text-slate-500">
                No students are assigned here yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </section>
  );
}

function ChildStructure({
  kind,
  programs,
  batches,
  sections,
  subjects,
}: {
  kind: "department" | "program";
  programs: Program[];
  batches: AcademicBatch[];
  sections: Section[];
  subjects: Array<{ id: number; name: string; code: string }>;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-[#0F172A]">
        {kind === "department" ? "Programs and cohorts" : "Batches and curriculum"}
      </h2>
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {(kind === "department" ? programs : batches).map((item) => {
          const href =
            kind === "department"
              ? `/institution/programs/${item.id}`
              : `/institution/batches/${item.id}`;
          return (
            <Link
              key={item.id}
              href={href}
              className="rounded-2xl bg-slate-50 p-4 transition hover:ring-1 hover:ring-[#38A3A5]"
            >
              <p className="font-semibold text-[#0F172A]">{item.name}</p>
              <p className="mt-1 text-sm text-slate-500">
                {kind === "department"
                  ? batches.filter(
                      (batch) =>
                        "name" in item && batch.program_name === item.name,
                    ).length + " batches"
                  : sections.filter((section) => section.batch_name === item.name)
                      .length + " sections"}
              </p>
            </Link>
          );
        })}
      </div>
      {kind === "program" && subjects.length ? (
        <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-200 pt-5">
          {subjects.map((subject) => (
            <span
              key={subject.id}
              className="rounded-full bg-[#E7F6F5] px-3 py-1.5 text-sm text-[#22577A]"
            >
              {subject.code} · {subject.name}
            </span>
          ))}
        </div>
      ) : null}
    </section>
  );
}

function QuickLink({
  href,
  title,
  text,
  icon: Icon,
}: {
  href: string;
  title: string;
  text: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#38A3A5]"
    >
      <Icon className="size-5 text-[#38A3A5]" />
      <h3 className="mt-3 font-semibold text-[#0F172A]">{title}</h3>
      <p className="mt-1 text-sm text-slate-500">{text}</p>
    </Link>
  );
}

function PathLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="rounded-full bg-slate-100 px-3 py-1.5 font-medium text-[#22577A] hover:bg-[#E7F6F5]"
    >
      {label}
    </Link>
  );
}

function InfoTile({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 font-semibold text-[#0F172A]">{value || "N/A"}</p>
    </div>
  );
}

function HeroStat({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="min-w-32 rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-xs text-slate-300">{label}</p>
      <p className="mt-1 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}

function NodeIcon({ kind }: { kind: NodeKind }) {
  const className = "size-8 text-[#57CC99]";
  if (kind === "department") return <Building2 className={className} />;
  if (kind === "program") return <GraduationCap className={className} />;
  if (kind === "batch") return <Layers3 className={className} />;
  return <UsersRound className={className} />;
}

function resolveDepartment(
  kind: NodeKind,
  directProgram: Program | undefined,
  directBatch: AcademicBatch | undefined,
  directSection: Section | undefined,
  departments: Department[],
  programs: Program[],
  batches: AcademicBatch[],
) {
  const program = resolveProgram(
    kind,
    directBatch,
    directSection,
    programs,
    batches,
  ) || directProgram;
  return departments.find(
    (item) =>
      item.id === program?.department || item.name === program?.department_name,
  );
}

function resolveProgram(
  kind: NodeKind,
  directBatch: AcademicBatch | undefined,
  directSection: Section | undefined,
  programs: Program[],
  batches: AcademicBatch[],
) {
  if (kind === "program") return undefined;
  const batch =
    directBatch ||
    (directSection ? resolveBatch(directSection, batches) : undefined);
  return programs.find(
    (item) => item.id === batch?.program || item.name === batch?.program_name,
  );
}

function resolveBatch(section: Section | undefined, batches: AcademicBatch[]) {
  return batches.find(
    (item) => item.id === section?.batch || item.name === section?.batch_name,
  );
}

function plural(kind: NodeKind) {
  return kind === "batch" ? "batches" : `${kind}s`;
}

function nodeStatus(kind: NodeKind, node: object) {
  if (kind === "batch" && "status" in node) return String(node.status);
  if ("is_active" in node) return node.is_active ? "active" : "inactive";
  return "active";
}

function nodeCode(kind: NodeKind, node: object) {
  if ((kind === "department" || kind === "program") && "code" in node) {
    return String(node.code);
  }
  if (kind === "batch" && "start_year" in node && "end_year" in node) {
    return `${String(node.start_year)}–${String(node.end_year)}`;
  }
  return `ID #${"id" in node ? String(node.id) : ""}`;
}

function buildSubtitle(
  kind: NodeKind,
  department?: Department,
  program?: Program,
  batch?: AcademicBatch,
  section?: Section,
) {
  if (kind === "department") return `HOD: ${department?.hod_name || "Unassigned"}`;
  if (kind === "program") {
    return `${department?.name || "Department"} · ${program?.degree_name || "Degree"}`;
  }
  if (kind === "batch") {
    return `${program?.name || "Program"} · Semester ${batch?.current_semester || "N/A"}`;
  }
  return `${batch?.name || "Batch"} · Class teacher: ${
    section?.class_teacher_name || "Unassigned"
  }`;
}
