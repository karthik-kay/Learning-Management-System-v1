"use client";

import {
  CalendarRange,
  ChevronRight,
  GraduationCap,
  Layers3,
  Plus,
  Search,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { InstitutionStatusBadge } from "@/components/institution/shared/status/InstitutionStatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  useInstitutionBatches,
  useInstitutionFaculty,
  useInstitutionPrograms,
  useInstitutionSections,
  useInstitutionStudents,
} from "@/hooks/queries/institution";
import type { UserRole } from "@/types/auth";
import type { AcademicBatch, Program, Section } from "@/types/institution";

import { AddStructureNodeDialog } from "./AddStructureNodeDialog";

interface AcademicStructureDirectoryProps {
  kind: "batch" | "section";
  role: UserRole;
}

export function AcademicStructureDirectory({
  kind,
  role,
}: AcademicStructureDirectoryProps) {
  const [search, setSearch] = useState("");
  const [parent, setParent] = useState("all");
  const [status, setStatus] = useState("all");
  const [addOpen, setAddOpen] = useState(false);

  const programsQuery = useInstitutionPrograms();
  const batchesQuery = useInstitutionBatches();
  const sectionsQuery = useInstitutionSections();
  const facultyQuery = useInstitutionFaculty({ page_size: "100" });
  const studentsQuery = useInstitutionStudents({ page_size: "100" });

  const programs = useMemo(
    () => programsQuery.data?.results ?? [],
    [programsQuery.data],
  );
  const batches = useMemo(
    () => batchesQuery.data?.results ?? [],
    [batchesQuery.data],
  );
  const sections = useMemo(
    () => sectionsQuery.data?.results ?? [],
    [sectionsQuery.data],
  );
  const students = useMemo(
    () => studentsQuery.data?.results ?? [],
    [studentsQuery.data],
  );

  const filteredBatches = useMemo(() => {
    const term = search.trim().toLowerCase();
    return batches.filter((batch) => {
      const matchesSearch =
        !term ||
        batch.name.toLowerCase().includes(term) ||
        batch.program_name.toLowerCase().includes(term);
      const matchesParent =
        parent === "all" || batch.program_name === parent;
      const matchesStatus = status === "all" || batch.status === status;
      return matchesSearch && matchesParent && matchesStatus;
    });
  }, [batches, parent, search, status]);

  const filteredSections = useMemo(() => {
    const term = search.trim().toLowerCase();
    return sections.filter((section) => {
      const matchesSearch =
        !term ||
        section.name.toLowerCase().includes(term) ||
        section.batch_name.toLowerCase().includes(term) ||
        section.class_teacher_name?.toLowerCase().includes(term);
      const matchesParent =
        parent === "all" || section.batch_name === parent;
      const matchesStatus =
        status === "all" ||
        (status === "active" && section.is_active) ||
        (status === "inactive" && !section.is_active);
      return matchesSearch && matchesParent && matchesStatus;
    });
  }, [parent, search, sections, status]);

  const isBatch = kind === "batch";
  const title = isBatch ? "Batches" : "Sections";
  const description = isBatch
    ? "Track academic cohorts by program, year, semester, sections, and enrollment."
    : "Manage class groups, assigned students, class teachers, capacity, and academic links.";
  const studentCount = (name: string, field: "batch_name" | "section_name") =>
    students.filter((student) => student[field] === name).length;

  return (
    <main className="space-y-6">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium text-[#E86C0D]">
            {role === "hod" ? "Department structure" : "Institution structure"}
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#0F172A]">
            {title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            {description}
          </p>
        </div>
        <Button
          className="rounded-xl bg-[#0F172A] hover:bg-[#22577A]"
          onClick={() => setAddOpen(true)}
        >
          <Plus className="size-4" />
          Add {isBatch ? "batch" : "section"}
        </Button>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-[minmax(240px,1fr)_220px_180px_auto]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={`Search ${title.toLowerCase()}`}
              className="h-10 rounded-xl border-slate-200 bg-slate-50 pl-9"
            />
          </div>
          <Select value={parent} onValueChange={setParent}>
            <SelectTrigger className="h-10 rounded-xl border-slate-200 bg-slate-50">
              <SelectValue placeholder={isBatch ? "Program" : "Batch"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                All {isBatch ? "programs" : "batches"}
              </SelectItem>
              {(isBatch ? programs : batches).map((item) => (
                <SelectItem key={item.id} value={item.name}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="h-10 rounded-xl border-slate-200 bg-slate-50">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {isBatch ? (
                <>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </>
              ) : (
                <>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            className="h-10 rounded-xl"
            onClick={() => {
              setSearch("");
              setParent("all");
              setStatus("all");
            }}
          >
            Reset
          </Button>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryTile
          label={title}
          value={isBatch ? filteredBatches.length : filteredSections.length}
          icon={isBatch ? Layers3 : UsersRound}
        />
        <SummaryTile
          label={isBatch ? "Programs represented" : "Batches represented"}
          value={
            new Set(
              (isBatch ? filteredBatches : filteredSections).map((item) =>
                isBatch
                  ? "program_name" in item
                    ? item.program_name
                    : ""
                  : "batch_name" in item
                    ? item.batch_name
                    : "",
              ),
            ).size
          }
          icon={GraduationCap}
        />
        <SummaryTile
          label="Students"
          value={
            isBatch
              ? students.filter((student) =>
                  filteredBatches.some(
                    (batch) => batch.name === student.batch_name,
                  ),
                ).length
              : students.filter((student) =>
                  filteredSections.some(
                    (section) => section.name === student.section_name,
                  ),
                ).length
          }
          icon={UsersRound}
        />
        <SummaryTile
          label={isBatch ? "Ongoing" : "Active"}
          value={
            isBatch
              ? filteredBatches.filter((batch) => batch.status === "ongoing")
                  .length
              : filteredSections.filter((section) => section.is_active).length
          }
          icon={CalendarRange}
        />
      </div>

      <StructureHierarchy
        kind={kind}
        programs={programs}
        batches={isBatch ? filteredBatches : batches}
        sections={isBatch ? sections : filteredSections}
      />

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead className="px-4">{isBatch ? "Batch" : "Section"}</TableHead>
              <TableHead>{isBatch ? "Program" : "Batch"}</TableHead>
              <TableHead>{isBatch ? "Academic years" : "Class teacher"}</TableHead>
              <TableHead>{isBatch ? "Semester" : "Capacity"}</TableHead>
              <TableHead>Students</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-12 text-right">Open</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(isBatch ? batchesQuery : sectionsQuery).isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  {Array.from({ length: 7 }).map((__, cell) => (
                    <TableCell key={cell} className="px-4 py-4">
                      <div className="h-4 animate-pulse rounded bg-slate-100" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : isBatch ? (
              filteredBatches.map((batch) => (
                <TableRow key={batch.id} className="group">
                  <TableCell className="px-4 py-4">
                    <Link
                      href={`/institution/batches/${batch.id}`}
                      className="font-semibold text-[#0F172A] hover:text-[#E86C0D]"
                    >
                      {batch.name}
                    </Link>
                  </TableCell>
                  <TableCell>{batch.program_name}</TableCell>
                  <TableCell>
                    {batch.start_year}–{batch.end_year}
                  </TableCell>
                  <TableCell>{batch.current_semester ?? "N/A"}</TableCell>
                  <TableCell>{studentCount(batch.name, "batch_name")}</TableCell>
                  <TableCell>
                    <InstitutionStatusBadge status={batch.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="ghost" size="icon" className="size-8">
                      <Link href={`/institution/batches/${batch.id}`}>
                        <ChevronRight className="size-4 text-slate-400" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              filteredSections.map((section) => (
                <TableRow key={section.id}>
                  <TableCell className="px-4 py-4">
                    <Link
                      href={`/institution/sections/${section.id}`}
                      className="font-semibold text-[#0F172A] hover:text-[#E86C0D]"
                    >
                      Section {section.name}
                    </Link>
                  </TableCell>
                  <TableCell>{section.batch_name}</TableCell>
                  <TableCell>{section.class_teacher_name || "Unassigned"}</TableCell>
                  <TableCell>{section.capacity ?? "N/A"}</TableCell>
                  <TableCell>
                    {studentCount(section.name, "section_name")}
                  </TableCell>
                  <TableCell>
                    <InstitutionStatusBadge
                      status={section.is_active ? "active" : "inactive"}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="ghost" size="icon" className="size-8">
                      <Link href={`/institution/sections/${section.id}`}>
                        <ChevronRight className="size-4 text-slate-400" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
            {(isBatch ? filteredBatches : filteredSections).length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-40 text-center text-slate-500">
                  No {title.toLowerCase()} match the selected filters.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </section>

      <AddStructureNodeDialog
        open={addOpen}
        kind={kind}
        programs={programs}
        batches={batches}
        faculty={facultyQuery.data?.results ?? []}
        onOpenChange={setAddOpen}
      />
    </main>
  );
}

function StructureHierarchy({
  kind,
  programs,
  batches,
  sections,
}: {
  kind: "batch" | "section";
  programs: Program[];
  batches: AcademicBatch[];
  sections: Section[];
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-[#E86C0D]">Hierarchy</p>
      <h2 className="mt-1 text-xl font-semibold text-[#0F172A]">
        {kind === "batch" ? "Program and batch tree" : "Batch and section tree"}
      </h2>
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {kind === "batch"
          ? programs.map((program) => (
              <div key={program.id} className="rounded-2xl bg-slate-50 p-4">
                <Link
                  href={`/institution/programs/${program.id}`}
                  className="flex items-center gap-3 font-semibold text-[#0F172A] hover:text-[#E86C0D]"
                >
                  <GraduationCap className="size-5 text-[#38A3A5]" />
                  {program.name}
                </Link>
                <div className="ml-2 mt-4 space-y-3 border-l border-slate-200 pl-5">
                  {batches
                    .filter((batch) => batch.program_name === program.name)
                    .map((batch) => (
                      <div key={batch.id}>
                        <Link
                          href={`/institution/batches/${batch.id}`}
                          className="font-semibold text-[#0F172A] hover:text-[#E86C0D]"
                        >
                          {batch.name}
                        </Link>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {sections
                            .filter(
                              (section) => section.batch_name === batch.name,
                            )
                            .map((section) => (
                              <Link
                                key={section.id}
                                href={`/institution/sections/${section.id}`}
                                className="rounded-full bg-white px-3 py-1 text-xs font-medium text-[#22577A]"
                              >
                                Section {section.name}
                              </Link>
                            ))}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))
          : batches.map((batch) => (
              <div key={batch.id} className="rounded-2xl bg-slate-50 p-4">
                <Link
                  href={`/institution/batches/${batch.id}`}
                  className="flex items-center gap-3 font-semibold text-[#0F172A] hover:text-[#E86C0D]"
                >
                  <Layers3 className="size-5 text-[#38A3A5]" />
                  {batch.name}
                </Link>
                <p className="ml-8 mt-1 text-xs text-slate-500">
                  {batch.program_name}
                </p>
                <div className="ml-2 mt-4 flex flex-wrap gap-2 border-l border-slate-200 pl-5">
                  {sections
                    .filter((section) => section.batch_name === batch.name)
                    .map((section) => (
                      <Link
                        key={section.id}
                        href={`/institution/sections/${section.id}`}
                        className="rounded-full bg-white px-3 py-1.5 text-sm font-medium text-[#22577A] hover:ring-1 hover:ring-[#38A3A5]"
                      >
                        Section {section.name}
                      </Link>
                    ))}
                </div>
              </div>
            ))}
      </div>
    </section>
  );
}

function SummaryTile({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-[#0F172A]">{value}</p>
        </div>
        <span className="flex size-10 items-center justify-center rounded-xl bg-[#E7F6F5] text-[#22577A]">
          <Icon className="size-5" />
        </span>
      </div>
    </div>
  );
}
