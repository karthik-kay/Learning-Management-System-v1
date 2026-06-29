"use client";

import { Download, Plus } from "lucide-react";
import { useMemo, useState } from "react";

import {
  ProgramDirectoryFilters,
  type ProgramFilterState,
} from "@/components/institution/shared/filters/ProgramDirectoryFilters";
import { Button } from "@/components/ui/button";
import {
  useInstitutionBatches,
  useInstitutionDegrees,
  useInstitutionDepartments,
  useInstitutionPrograms,
  useInstitutionSections,
  useInstitutionSubjects,
} from "@/hooks/queries/institution";
import type { Program } from "@/types/institution";

import { AddProgramDialog } from "./AddProgramDialog";
import { ExportProgramsDialog } from "./ExportProgramsDialog";
import { ProgramDetailDrawer } from "./ProgramDetailDrawer";
import { ProgramHierarchyView } from "./ProgramHierarchyView";
import { ProgramTable } from "./ProgramTable";

const emptyFilters: ProgramFilterState = {
  search: "",
  department: "all",
  status: "all",
};

interface ProgramManagementViewProps {
  scope: "admin" | "hod";
  title: string;
  description: string;
}

export function ProgramManagementView({
  scope,
  title,
  description,
}: ProgramManagementViewProps) {
  const [filters, setFilters] = useState<ProgramFilterState>(emptyFilters);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  const programsQuery = useInstitutionPrograms();
  const departmentsQuery = useInstitutionDepartments();
  const degreesQuery = useInstitutionDegrees();
  const batchesQuery = useInstitutionBatches();
  const sectionsQuery = useInstitutionSections();
  const subjectsQuery = useInstitutionSubjects();

  const programs = useMemo(() => {
    const rows = programsQuery.data?.results ?? [];
    const search = filters.search.trim().toLowerCase();

    return rows.filter((program) => {
      const matchesSearch =
        !search ||
        program.name.toLowerCase().includes(search) ||
        program.code.toLowerCase().includes(search) ||
        program.department_name.toLowerCase().includes(search) ||
        program.degree_name.toLowerCase().includes(search);
      const matchesDepartment =
        filters.department === "all" ||
        program.department_name === filters.department;
      const matchesStatus =
        filters.status === "all" ||
        (filters.status === "active" && program.is_active) ||
        (filters.status === "inactive" && !program.is_active);

      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [
    filters.department,
    filters.search,
    filters.status,
    programsQuery.data?.results,
  ]);

  const openProgram = (program: Program) => {
    setSelectedProgram(program);
    setDrawerOpen(true);
  };

  const selectedBatches = useMemo(() => {
    if (!selectedProgram) return [];
    return (batchesQuery.data?.results ?? []).filter(
      (batch) => batch.program_name === selectedProgram.name,
    );
  }, [batchesQuery.data?.results, selectedProgram]);

  const selectedSections = useMemo(() => {
    const batchNames = new Set(selectedBatches.map((batch) => batch.name));
    return (sectionsQuery.data?.results ?? []).filter((section) =>
      batchNames.has(section.batch_name),
    );
  }, [sectionsQuery.data?.results, selectedBatches]);

  const selectedSubjects = useMemo(() => {
    if (!selectedProgram) return [];
    return (subjectsQuery.data?.results ?? []).filter(
      (subject) => subject.program_name === selectedProgram.name,
    );
  }, [selectedProgram, subjectsQuery.data?.results]);

  const exportFilters = useMemo(() => {
    const values: Record<string, unknown> = {};
    if (filters.search.trim()) values.search = filters.search.trim();
    if (filters.department !== "all") values.department = filters.department;
    if (filters.status !== "all") values.status = filters.status;
    return values;
  }, [filters.department, filters.search, filters.status]);

  return (
    <main className="space-y-6">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium text-[#E86C0D]">
            {scope === "hod" ? "Department programs" : "Institution programs"}
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#0F172A]">
            {title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            {description}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            className="rounded-xl"
            onClick={() => setExportOpen(true)}
          >
            <Download className="size-4" />
            Export
          </Button>
          <Button
            type="button"
            className="rounded-xl bg-[#0F172A] hover:bg-[#22577A]"
            onClick={() => setAddOpen(true)}
          >
            <Plus className="size-4" />
            Add program
          </Button>
        </div>
      </section>

      <ProgramDirectoryFilters
        filters={filters}
        departments={departmentsQuery.data?.results ?? []}
        onChange={setFilters}
        onReset={() => setFilters(emptyFilters)}
      />

      <div className="grid gap-4 md:grid-cols-4">
        <SummaryTile label="Programs" value={programs.length} />
        <SummaryTile
          label="Batches"
          value={(batchesQuery.data?.results ?? []).filter((batch) =>
            programs.some((program) => program.name === batch.program_name),
          ).length}
        />
        <SummaryTile
          label="Subjects"
          value={(subjectsQuery.data?.results ?? []).filter((subject) =>
            programs.some((program) => program.name === subject.program_name),
          ).length}
        />
        <SummaryTile
          label="Total intake"
          value={programs.reduce(
            (total, program) => total + (program.intake_capacity ?? 0),
            0,
          )}
        />
      </div>

      <ProgramHierarchyView
        programs={programs}
        batches={batchesQuery.data?.results ?? []}
        sections={sectionsQuery.data?.results ?? []}
        subjects={subjectsQuery.data?.results ?? []}
      />

      <ProgramTable
        programs={programs}
        isLoading={programsQuery.isLoading}
        onSelect={openProgram}
      />

      <ProgramDetailDrawer
        open={drawerOpen}
        program={selectedProgram}
        batches={selectedBatches}
        sections={selectedSections}
        subjects={selectedSubjects}
        onOpenChange={setDrawerOpen}
      />

      <AddProgramDialog
        open={addOpen}
        departments={departmentsQuery.data?.results ?? []}
        degrees={degreesQuery.data?.results ?? []}
        onOpenChange={setAddOpen}
      />

      <ExportProgramsDialog
        open={exportOpen}
        filters={exportFilters}
        onOpenChange={setExportOpen}
      />
    </main>
  );
}

function SummaryTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-[#0F172A]">{value}</p>
    </div>
  );
}
