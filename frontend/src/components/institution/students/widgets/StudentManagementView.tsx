"use client";

import { Download, Plus, Upload } from "lucide-react";
import { useMemo, useState } from "react";

import {
  StudentDirectoryFilters,
  type StudentFilterState,
} from "@/components/institution/shared/filters/StudentDirectoryFilters";
import { Button } from "@/components/ui/button";
import {
  useInstitutionBatches,
  useInstitutionDepartments,
  useInstitutionPrograms,
  useInstitutionSections,
  useInstitutionStudent,
  useInstitutionStudents,
} from "@/hooks/queries/institution";
import {
  usePromoteInstitutionStudent,
  useSuspendInstitutionStudent,
} from "@/hooks/mutations/institution/useInstitutionPeopleMutations";
import type { InstitutionStudent } from "@/types/institution";

import { AddStudentDialog } from "./AddStudentDialog";
import { BulkImportStudentsDialog } from "./BulkImportStudentsDialog";
import { ExportStudentsDialog } from "./ExportStudentsDialog";
import { StudentDetailDrawer } from "./StudentDetailDrawer";
import { StudentTable } from "./StudentTable";

const emptyFilters: StudentFilterState = {
  search: "",
  enrollment: "",
  department: "all",
  batch: "all",
  section: "all",
  status: "all",
};

interface StudentManagementViewProps {
  scope: "admin" | "hod";
  title: string;
  description: string;
}

export function StudentManagementView({
  scope,
  title,
  description,
}: StudentManagementViewProps) {
  const [filters, setFilters] = useState<StudentFilterState>(emptyFilters);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  const serverParams = useMemo(() => {
    const params: Record<string, string> = { page_size: "50" };

    if (filters.department !== "all") params.department = filters.department;
    if (filters.batch !== "all") params.batch = filters.batch;
    if (filters.section !== "all") params.section = filters.section;
    if (filters.status !== "all") params.status = filters.status;

    return params;
  }, [filters.batch, filters.department, filters.section, filters.status]);

  const studentsQuery = useInstitutionStudents(serverParams);
  const studentDetailQuery = useInstitutionStudent(
    selectedId ?? Number.NaN,
    drawerOpen && selectedId !== null,
  );
  const departmentsQuery = useInstitutionDepartments();
  const programsQuery = useInstitutionPrograms();
  const batchesQuery = useInstitutionBatches();
  const sectionsQuery = useInstitutionSections();
  const suspendStudent = useSuspendInstitutionStudent();
  const promoteStudent = usePromoteInstitutionStudent();

  const students = useMemo(() => {
    const rows = studentsQuery.data?.results ?? [];
    const search = filters.search.trim().toLowerCase();
    const enrollment = filters.enrollment.trim().toLowerCase();

    return rows.filter((student) => {
      const matchesSearch =
        !search ||
        student.name.toLowerCase().includes(search) ||
        student.email.toLowerCase().includes(search);
      const matchesEnrollment =
        !enrollment ||
        student.enrollment_number?.toLowerCase().includes(enrollment);

      return matchesSearch && matchesEnrollment;
    });
  }, [filters.enrollment, filters.search, studentsQuery.data?.results]);

  const handleSelect = (student: InstitutionStudent) => {
    setSelectedId(student.id);
    setDrawerOpen(true);
  };

  const handleSuspend = (student?: InstitutionStudent) => {
    const studentId = student?.id ?? selectedId;
    if (!studentId || suspendStudent.isPending) return;
    suspendStudent.mutate(studentId);
  };

  const handlePromote = (student?: InstitutionStudent) => {
    const studentId = student?.id ?? selectedId;
    if (!studentId || promoteStudent.isPending) return;
    promoteStudent.mutate(studentId);
  };

  return (
    <main className="space-y-6">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium text-[#E86C0D]">
            {scope === "hod" ? "Department students" : "Institution students"}
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
            onClick={() => setImportOpen(true)}
          >
            <Upload className="size-4" />
            Bulk import
          </Button>
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
            Add student
          </Button>
        </div>
      </section>

      <StudentDirectoryFilters
        filters={filters}
        departments={departmentsQuery.data?.results ?? []}
        batches={batchesQuery.data?.results ?? []}
        sections={sectionsQuery.data?.results ?? []}
        onChange={setFilters}
        onReset={() => setFilters(emptyFilters)}
      />

      <div className="grid gap-4 md:grid-cols-4">
        <SummaryTile label="Students shown" value={students.length} />
        <SummaryTile label="Total matched" value={studentsQuery.data?.count ?? 0} />
        <SummaryTile
          label="Active"
          value={students.filter((student) => student.status === "active").length}
        />
        <SummaryTile
          label="On leave"
          value={students.filter((student) => student.status === "on_leave").length}
        />
      </div>

      <StudentTable
        students={students}
        isLoading={studentsQuery.isLoading}
        onSelect={handleSelect}
        onSuspend={handleSuspend}
        onPromote={handlePromote}
      />

      <StudentDetailDrawer
        open={drawerOpen}
        student={studentDetailQuery.data}
        isLoading={studentDetailQuery.isLoading}
        onOpenChange={setDrawerOpen}
        onSuspend={() => handleSuspend()}
        onPromote={() => handlePromote()}
      />

      <AddStudentDialog
        open={addOpen}
        departments={departmentsQuery.data?.results ?? []}
        programs={programsQuery.data?.results ?? []}
        batches={batchesQuery.data?.results ?? []}
        sections={sectionsQuery.data?.results ?? []}
        onOpenChange={setAddOpen}
      />

      <BulkImportStudentsDialog open={importOpen} onOpenChange={setImportOpen} />

      <ExportStudentsDialog
        open={exportOpen}
        filters={exportFilters(serverParams)}
        onOpenChange={setExportOpen}
      />
    </main>
  );
}

function exportFilters(params: Record<string, string>) {
  const filters = { ...params };
  delete filters.page_size;
  return filters;
}

function SummaryTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-[#0F172A]">{value}</p>
    </div>
  );
}
