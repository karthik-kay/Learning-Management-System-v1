"use client";

import { Download, Plus } from "lucide-react";
import { useMemo, useState } from "react";

import {
  ExamDirectoryFilters,
  type ExamFilterState,
} from "@/components/institution/shared/filters/ExamDirectoryFilters";
import { Button } from "@/components/ui/button";
import { usePublishInstitutionExam } from "@/hooks/mutations/institution";
import {
  useInstitutionBatches,
  useInstitutionExamResults,
  useInstitutionExamSubjects,
  useInstitutionExams,
} from "@/hooks/queries/institution";
import type { Exam } from "@/types/institution";

import { AddExamDialog } from "./AddExamDialog";
import { ExamDetailDrawer } from "./ExamDetailDrawer";
import { ExamTable } from "./ExamTable";
import { ExportExamsDialog } from "./ExportExamsDialog";

const emptyFilters: ExamFilterState = {
  search: "",
  type: "all",
  publish: "all",
};

interface ExamManagementViewProps {
  scope: "admin" | "hod";
  title: string;
  description: string;
}

export function ExamManagementView({
  scope,
  title,
  description,
}: ExamManagementViewProps) {
  const [filters, setFilters] = useState<ExamFilterState>(emptyFilters);
  const [selected, setSelected] = useState<Exam | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  const examsQuery = useInstitutionExams();
  const batchesQuery = useInstitutionBatches();
  const resultsQuery = useInstitutionExamResults();
  const examSubjectsQuery = useInstitutionExamSubjects(
    selected?.id ?? Number.NaN,
    drawerOpen && Boolean(selected?.id),
  );
  const publishExam = usePublishInstitutionExam();

  const exams = useMemo(() => {
    const rows = examsQuery.data?.results ?? [];
    const search = filters.search.trim().toLowerCase();
    return rows.filter((exam) => {
      const matchesSearch =
        !search ||
        exam.name.toLowerCase().includes(search) ||
        exam.batch_name?.toLowerCase().includes(search);
      const matchesType = filters.type === "all" || exam.exam_type === filters.type;
      const matchesPublish =
        filters.publish === "all" ||
        (filters.publish === "published" && exam.is_published) ||
        (filters.publish === "draft" && !exam.is_published);
      return matchesSearch && matchesType && matchesPublish;
    });
  }, [examsQuery.data?.results, filters.publish, filters.search, filters.type]);

  const openExam = (exam: Exam) => {
    setSelected(exam);
    setDrawerOpen(true);
  };

  const examSubjectNames = useMemo(
    () =>
      new Set(
        (examSubjectsQuery.data?.results ?? examSubjectsQuery.data ?? []).map(
          (subject) => subject.subject_name,
        ),
      ),
    [examSubjectsQuery.data],
  );

  const selectedResults = useMemo(
    () =>
      (resultsQuery.data?.results ?? []).filter((result) =>
        examSubjectNames.has(result.subject_name),
      ),
    [examSubjectNames, resultsQuery.data?.results],
  );

  const exportFilters = useMemo(() => {
    const values: Record<string, unknown> = {};
    if (filters.search.trim()) values.search = filters.search.trim();
    if (filters.type !== "all") values.type = filters.type;
    if (filters.publish !== "all") values.publish = filters.publish;
    return values;
  }, [filters.publish, filters.search, filters.type]);

  return (
    <main className="space-y-6">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium text-[#E86C0D]">
            {scope === "hod" ? "Department exams" : "Institution exams"}
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
          <Button className="rounded-xl bg-[#0F172A]" onClick={() => setAddOpen(true)}>
            <Plus className="size-4" />
            Add exam
          </Button>
        </div>
      </section>

      <ExamDirectoryFilters
        filters={filters}
        onChange={setFilters}
        onReset={() => setFilters(emptyFilters)}
      />

      <div className="grid gap-4 md:grid-cols-4">
        <SummaryTile label="Exams" value={exams.length} />
        <SummaryTile label="Published" value={exams.filter((exam) => exam.is_published).length} />
        <SummaryTile label="Drafts" value={exams.filter((exam) => !exam.is_published).length} />
        <SummaryTile label="Results" value={resultsQuery.data?.count ?? 0} />
      </div>

      <ExamTable
        exams={exams}
        isLoading={examsQuery.isLoading}
        onSelect={openExam}
        onPublish={(exam) => publishExam.mutate(exam.id)}
      />

      <ExamDetailDrawer
        open={drawerOpen}
        exam={selected}
        subjects={
          Array.isArray(examSubjectsQuery.data)
            ? examSubjectsQuery.data
            : examSubjectsQuery.data?.results ?? []
        }
        results={selectedResults}
        onOpenChange={setDrawerOpen}
      />

      <AddExamDialog
        open={addOpen}
        batches={batchesQuery.data?.results ?? []}
        onOpenChange={setAddOpen}
      />

      <ExportExamsDialog
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
