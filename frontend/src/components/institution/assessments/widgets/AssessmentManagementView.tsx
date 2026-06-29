"use client";

import { Download, FilePlus2, Plus } from "lucide-react";
import { useMemo, useState } from "react";

import {
  AssessmentDirectoryFilters,
  type AssessmentFilterState,
} from "@/components/institution/shared/filters/AssessmentDirectoryFilters";
import { Button } from "@/components/ui/button";
import {
  useInstitutionAssignments,
  useInstitutionBatches,
  useInstitutionComponentScores,
  useInstitutionEvaluationComponents,
  useInstitutionSections,
  useInstitutionSubjects,
} from "@/hooks/queries/institution";
import type { EvaluationComponent } from "@/types/institution";

import { AddAssessmentDialog } from "./AddAssessmentDialog";
import { AddAssignmentDialog } from "./AddAssignmentDialog";
import { AssessmentDetailDrawer } from "./AssessmentDetailDrawer";
import { AssessmentTable } from "./AssessmentTable";
import { ExportAssessmentsDialog } from "./ExportAssessmentsDialog";

const emptyFilters: AssessmentFilterState = {
  search: "",
  type: "all",
  mode: "all",
};

interface AssessmentManagementViewProps {
  scope: "admin" | "hod";
  title: string;
  description: string;
}

export function AssessmentManagementView({
  scope,
  title,
  description,
}: AssessmentManagementViewProps) {
  const [filters, setFilters] = useState<AssessmentFilterState>(emptyFilters);
  const [selected, setSelected] = useState<EvaluationComponent | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [assignmentOpen, setAssignmentOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  const componentsQuery = useInstitutionEvaluationComponents();
  const scoresQuery = useInstitutionComponentScores();
  const assignmentsQuery = useInstitutionAssignments();
  const subjectsQuery = useInstitutionSubjects();
  const batchesQuery = useInstitutionBatches();
  const sectionsQuery = useInstitutionSections();

  const components = useMemo(() => {
    const rows = componentsQuery.data?.results ?? [];
    const search = filters.search.trim().toLowerCase();
    return rows.filter((component) => {
      const matchesSearch =
        !search ||
        component.name.toLowerCase().includes(search) ||
        component.subject_name?.toLowerCase().includes(search) ||
        component.batch_name?.toLowerCase().includes(search);
      const matchesType =
        filters.type === "all" || component.component_type === filters.type;
      const matchesMode =
        filters.mode === "all" ||
        (filters.mode === "internal" && component.is_internal) ||
        (filters.mode === "external" && !component.is_internal);
      return matchesSearch && matchesType && matchesMode;
    });
  }, [componentsQuery.data?.results, filters.mode, filters.search, filters.type]);

  const selectedAssignments = useMemo(
    () =>
      selected
        ? (assignmentsQuery.data?.results ?? []).filter(
            (assignment) => assignment.component_name === selected.name,
          )
        : [],
    [assignmentsQuery.data?.results, selected],
  );

  const selectedScores = useMemo(
    () =>
      selected
        ? (scoresQuery.data?.results ?? []).filter(
            (score) => score.component === selected.id,
          )
        : [],
    [scoresQuery.data?.results, selected],
  );

  const openComponent = (component: EvaluationComponent) => {
    setSelected(component);
    setDrawerOpen(true);
  };

  const exportFilters = useMemo(() => {
    const values: Record<string, unknown> = {};
    if (filters.search.trim()) values.search = filters.search.trim();
    if (filters.type !== "all") values.type = filters.type;
    if (filters.mode !== "all") values.mode = filters.mode;
    return values;
  }, [filters.mode, filters.search, filters.type]);

  return (
    <main className="space-y-6">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium text-[#E86C0D]">
            {scope === "hod" ? "Department assessments" : "Institution assessments"}
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#0F172A]">
            {title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            {description}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="rounded-xl" onClick={() => setExportOpen(true)}>
            <Download className="size-4" />
            Export
          </Button>
          <Button variant="outline" className="rounded-xl" onClick={() => setAssignmentOpen(true)}>
            <FilePlus2 className="size-4" />
            Add assignment
          </Button>
          <Button className="rounded-xl bg-[#0F172A]" onClick={() => setAddOpen(true)}>
            <Plus className="size-4" />
            Add assessment
          </Button>
        </div>
      </section>

      <AssessmentDirectoryFilters
        filters={filters}
        onChange={setFilters}
        onReset={() => setFilters(emptyFilters)}
      />

      <div className="grid gap-4 md:grid-cols-4">
        <SummaryTile label="Assessments" value={components.length} />
        <SummaryTile label="Assignments" value={assignmentsQuery.data?.count ?? 0} />
        <SummaryTile label="Scores" value={scoresQuery.data?.count ?? 0} />
        <SummaryTile
          label="Internal"
          value={components.filter((component) => component.is_internal).length}
        />
      </div>

      <AssessmentTable
        components={components}
        isLoading={componentsQuery.isLoading}
        onSelect={openComponent}
      />

      <AssessmentDetailDrawer
        open={drawerOpen}
        component={selected}
        assignments={selectedAssignments}
        scores={selectedScores}
        onOpenChange={setDrawerOpen}
      />

      <AddAssessmentDialog
        open={addOpen}
        subjects={subjectsQuery.data?.results ?? []}
        batches={batchesQuery.data?.results ?? []}
        sections={sectionsQuery.data?.results ?? []}
        onOpenChange={setAddOpen}
      />

      <AddAssignmentDialog
        open={assignmentOpen}
        components={componentsQuery.data?.results ?? []}
        onOpenChange={setAssignmentOpen}
      />

      <ExportAssessmentsDialog
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
