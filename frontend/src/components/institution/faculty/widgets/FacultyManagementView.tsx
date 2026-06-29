"use client";

import { Download, Plus, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";

import {
  FacultyDirectoryFilters,
  type FacultyFilterState,
} from "@/components/institution/shared/filters/FacultyDirectoryFilters";
import { Button } from "@/components/ui/button";
import {
  useInstitutionDepartments,
  useInstitutionFaculty,
  useInstitutionFacultyDetail,
} from "@/hooks/queries/institution";
import {
  useOffboardInstitutionFaculty,
  useReactivateInstitutionFaculty,
  useSuspendInstitutionFaculty,
} from "@/hooks/mutations/institution";
import type { InstitutionFaculty } from "@/types/institution";

import { AddFacultyDialog } from "./AddFacultyDialog";
import { AssignHodDialog } from "./AssignHodDialog";
import { ExportFacultyDialog } from "./ExportFacultyDialog";
import { FacultyDetailDrawer } from "./FacultyDetailDrawer";
import { FacultyTable } from "./FacultyTable";

const emptyFilters: FacultyFilterState = {
  search: "",
  employee: "",
  department: "all",
  status: "all",
};

interface FacultyManagementViewProps {
  scope: "admin" | "hod";
  title: string;
  description: string;
}

export function FacultyManagementView({
  scope,
  title,
  description,
}: FacultyManagementViewProps) {
  const [filters, setFilters] = useState<FacultyFilterState>(emptyFilters);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedFaculty, setSelectedFaculty] =
    useState<InstitutionFaculty | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [hodOpen, setHodOpen] = useState(false);

  const serverParams = useMemo(() => {
    const params: Record<string, string> = { page_size: "50" };
    if (filters.department !== "all") params.department = filters.department;
    if (filters.status !== "all") params.status = filters.status;
    return params;
  }, [filters.department, filters.status]);

  const facultyQuery = useInstitutionFaculty(serverParams);
  const facultyDetailQuery = useInstitutionFacultyDetail(
    selectedId ?? Number.NaN,
    drawerOpen && selectedId !== null,
  );
  const departmentsQuery = useInstitutionDepartments();
  const suspendFaculty = useSuspendInstitutionFaculty();
  const reactivateFaculty = useReactivateInstitutionFaculty();
  const offboardFaculty = useOffboardInstitutionFaculty();

  const faculty = useMemo(() => {
    const rows = facultyQuery.data?.results ?? [];
    const search = filters.search.trim().toLowerCase();
    const employee = filters.employee.trim().toLowerCase();

    return rows.filter((member) => {
      const matchesSearch =
        !search ||
        member.name.toLowerCase().includes(search) ||
        member.email.toLowerCase().includes(search) ||
        member.designation?.toLowerCase().includes(search);
      const matchesEmployee =
        !employee || member.employee_id?.toLowerCase().includes(employee);

      return matchesSearch && matchesEmployee;
    });
  }, [facultyQuery.data?.results, filters.employee, filters.search]);

  const handleSelect = (member: InstitutionFaculty) => {
    setSelectedFaculty(member);
    setSelectedId(member.id);
    setDrawerOpen(true);
  };

  const handleMakeHod = (member?: InstitutionFaculty | null) => {
    if (member) {
      setSelectedFaculty(member);
      setSelectedId(member.id);
    }
    setHodOpen(true);
  };

  const handleSuspend = (member?: InstitutionFaculty) => {
    const facultyId = member?.id ?? selectedId;
    if (!facultyId || suspendFaculty.isPending) return;
    suspendFaculty.mutate(facultyId);
  };

  const handleReactivate = (member?: InstitutionFaculty) => {
    const facultyId = member?.id ?? selectedId;
    if (!facultyId || reactivateFaculty.isPending) return;
    reactivateFaculty.mutate(facultyId);
  };

  const handleOffboard = (member?: InstitutionFaculty) => {
    const facultyId = member?.id ?? selectedId;
    if (!facultyId || offboardFaculty.isPending) return;
    offboardFaculty.mutate(facultyId);
  };

  return (
    <main className="space-y-6">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium text-[#E86C0D]">
            {scope === "hod" ? "Department faculty" : "Institution faculty"}
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
            onClick={() => {
              setSelectedFaculty(null);
              setHodOpen(true);
            }}
          >
            <ShieldCheck className="size-4" />
            Assign HOD
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
            Add faculty
          </Button>
        </div>
      </section>

      <FacultyDirectoryFilters
        filters={filters}
        departments={departmentsQuery.data?.results ?? []}
        onChange={setFilters}
        onReset={() => setFilters(emptyFilters)}
      />

      <div className="grid gap-4 md:grid-cols-4">
        <SummaryTile label="Faculty shown" value={faculty.length} />
        <SummaryTile label="Total matched" value={facultyQuery.data?.count ?? 0} />
        <SummaryTile
          label="Active"
          value={faculty.filter((member) => member.status === "active").length}
        />
        <SummaryTile
          label="Inactive"
          value={faculty.filter((member) => member.status === "inactive").length}
        />
      </div>

      <FacultyTable
        faculty={faculty}
        isLoading={facultyQuery.isLoading}
        onSelect={handleSelect}
        onSuspend={handleSuspend}
        onReactivate={handleReactivate}
        onOffboard={handleOffboard}
        onMakeHod={handleMakeHod}
      />

      <FacultyDetailDrawer
        open={drawerOpen}
        faculty={facultyDetailQuery.data}
        isLoading={facultyDetailQuery.isLoading}
        onOpenChange={setDrawerOpen}
        onSuspend={() => handleSuspend()}
        onReactivate={() => handleReactivate()}
        onOffboard={() => handleOffboard()}
        onMakeHod={() => handleMakeHod(selectedFaculty)}
      />

      <AddFacultyDialog
        open={addOpen}
        departments={departmentsQuery.data?.results ?? []}
        onOpenChange={setAddOpen}
      />

      <AssignHodDialog
        open={hodOpen}
        faculty={selectedFaculty}
        facultyList={faculty}
        departments={departmentsQuery.data?.results ?? []}
        onOpenChange={setHodOpen}
      />

      <ExportFacultyDialog
        open={exportOpen}
        filters={exportFilters(serverParams)}
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

function exportFilters(params: Record<string, string>) {
  const filters = { ...params };
  delete filters.page_size;
  return filters;
}
