"use client";

import { Download, Plus } from "lucide-react";
import { useMemo, useState } from "react";

import {
  DepartmentDirectoryFilters,
  type DepartmentFilterState,
} from "@/components/institution/shared/filters/DepartmentDirectoryFilters";
import { Button } from "@/components/ui/button";
import {
  useInstitutionBatches,
  useInstitutionDepartments,
  useInstitutionFaculty,
  useInstitutionPrograms,
  useInstitutionSections,
  useInstitutionSubjects,
} from "@/hooks/queries/institution";
import type { Department } from "@/types/institution";

import { AddDepartmentDialog } from "./AddDepartmentDialog";
import { DepartmentDetailDrawer } from "./DepartmentDetailDrawer";
import { DepartmentHierarchyView } from "./DepartmentHierarchyView";
import { DepartmentTable } from "./DepartmentTable";
import { ExportDepartmentsDialog } from "./ExportDepartmentsDialog";

const emptyFilters: DepartmentFilterState = {
  search: "",
  status: "all",
};

interface DepartmentManagementViewProps {
  scope: "admin" | "hod";
  title: string;
  description: string;
}

export function DepartmentManagementView({
  scope,
  title,
  description,
}: DepartmentManagementViewProps) {
  const [filters, setFilters] = useState<DepartmentFilterState>(emptyFilters);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(
    null,
  );
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  const departmentsQuery = useInstitutionDepartments();
  const programsQuery = useInstitutionPrograms();
  const batchesQuery = useInstitutionBatches();
  const sectionsQuery = useInstitutionSections();
  const subjectsQuery = useInstitutionSubjects();
  const facultyQuery = useInstitutionFaculty({ page_size: "100" });

  const departments = useMemo(() => {
    const rows = departmentsQuery.data?.results ?? [];
    const search = filters.search.trim().toLowerCase();

    return rows.filter((department) => {
      const matchesSearch =
        !search ||
        department.name.toLowerCase().includes(search) ||
        department.code.toLowerCase().includes(search) ||
        department.hod_name?.toLowerCase().includes(search);
      const matchesStatus =
        filters.status === "all" ||
        (filters.status === "active" && department.is_active) ||
        (filters.status === "inactive" && !department.is_active);

      return matchesSearch && matchesStatus;
    });
  }, [departmentsQuery.data?.results, filters.search, filters.status]);

  const openDepartment = (department: Department) => {
    setSelectedDepartment(department);
    setDrawerOpen(true);
  };

  const exportFilters = useMemo(() => {
    const values: Record<string, unknown> = {};
    if (filters.search.trim()) values.search = filters.search.trim();
    if (filters.status !== "all") values.status = filters.status;
    return values;
  }, [filters.search, filters.status]);

  const selectedPrograms = useMemo(() => {
    if (!selectedDepartment) return [];
    return (programsQuery.data?.results ?? []).filter(
      (program) => program.department_name === selectedDepartment.name,
    );
  }, [programsQuery.data?.results, selectedDepartment]);

  const selectedBatches = useMemo(() => {
    const programNames = new Set(selectedPrograms.map((program) => program.name));
    return (batchesQuery.data?.results ?? []).filter((batch) =>
      programNames.has(batch.program_name),
    );
  }, [batchesQuery.data?.results, selectedPrograms]);

  const selectedSubjects = useMemo(() => {
    const programNames = new Set(selectedPrograms.map((program) => program.name));
    return (subjectsQuery.data?.results ?? []).filter((subject) =>
      programNames.has(subject.program_name),
    );
  }, [selectedPrograms, subjectsQuery.data?.results]);

  const selectedFaculty = useMemo(() => {
    if (!selectedDepartment) return [];
    return (facultyQuery.data?.results ?? []).filter(
      (member) => member.department_name === selectedDepartment.name,
    );
  }, [facultyQuery.data?.results, selectedDepartment]);

  return (
    <main className="space-y-6">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium text-[#E86C0D]">
            {scope === "hod" ? "Department scope" : "Institution structure"}
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
            Add department
          </Button>
        </div>
      </section>

      <DepartmentDirectoryFilters
        filters={filters}
        onChange={setFilters}
        onReset={() => setFilters(emptyFilters)}
      />

      <div className="grid gap-4 md:grid-cols-4">
        <SummaryTile label="Departments" value={departments.length} />
        <SummaryTile
          label="Programs"
          value={departments.reduce((total, item) => total + (item.program_count ?? 0), 0)}
        />
        <SummaryTile
          label="Faculty"
          value={departments.reduce((total, item) => total + (item.faculty_count ?? 0), 0)}
        />
        <SummaryTile
          label="Students"
          value={departments.reduce((total, item) => total + (item.student_count ?? 0), 0)}
        />
      </div>

      <DepartmentHierarchyView
        departments={departments}
        programs={programsQuery.data?.results ?? []}
        batches={batchesQuery.data?.results ?? []}
        sections={sectionsQuery.data?.results ?? []}
      />

      <DepartmentTable
        departments={departments}
        isLoading={departmentsQuery.isLoading}
        onSelect={openDepartment}
      />

      <DepartmentDetailDrawer
        open={drawerOpen}
        department={selectedDepartment}
        programs={selectedPrograms}
        faculty={selectedFaculty}
        subjects={selectedSubjects}
        batches={selectedBatches}
        sections={sectionsQuery.data?.results ?? []}
        onOpenChange={setDrawerOpen}
      />

      <AddDepartmentDialog
        open={addOpen}
        faculty={facultyQuery.data?.results ?? []}
        onOpenChange={setAddOpen}
      />

      <ExportDepartmentsDialog
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
