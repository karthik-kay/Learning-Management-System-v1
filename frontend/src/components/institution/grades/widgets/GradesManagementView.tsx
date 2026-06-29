"use client";

import {
  Calculator,
  CheckCircle2,
  FileUp,
  GraduationCap,
  Send,
  TrendingUp,
} from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useInstitutionComponentScores,
  useInstitutionEvaluationComponents,
  useInstitutionExamResults,
  useInstitutionExams,
  useInstitutionStudents,
  useInstitutionSubjectResults,
  useInstitutionSubjects,
} from "@/hooks/queries/institution";

import { BulkScoreUploadDialog } from "./BulkScoreUploadDialog";
import { ComputeResultDialog } from "./ComputeResultDialog";
import {
  ComponentsTable,
  ExamScoresTable,
  SubjectResultsTable,
} from "./GradesResultTable";
import { PublishResultsDialog } from "./PublishResultsDialog";

interface GradesManagementViewProps {
  scope: "admin" | "hod";
  title: string;
  description: string;
}

export function GradesManagementView({
  scope,
  title,
  description,
}: GradesManagementViewProps) {
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("all");
  const [grade, setGrade] = useState("all");
  const [bulkOpen, setBulkOpen] = useState(false);
  const [computeOpen, setComputeOpen] = useState(false);
  const [publishOpen, setPublishOpen] = useState(false);

  const examsQuery = useInstitutionExams();
  const examResultsQuery = useInstitutionExamResults();
  const subjectResultsQuery = useInstitutionSubjectResults();
  const componentsQuery = useInstitutionEvaluationComponents();
  const scoresQuery = useInstitutionComponentScores();
  const studentsQuery = useInstitutionStudents();
  const subjectsQuery = useInstitutionSubjects();

  const exams = useMemo(() => examsQuery.data?.results ?? [], [examsQuery.data]);
  const subjectResults = useMemo(
    () => subjectResultsQuery.data?.results ?? [],
    [subjectResultsQuery.data],
  );
  const examResults = useMemo(
    () => examResultsQuery.data?.results ?? [],
    [examResultsQuery.data],
  );
  const components = useMemo(
    () => componentsQuery.data?.results ?? [],
    [componentsQuery.data],
  );
  const students = useMemo(
    () => studentsQuery.data?.results ?? [],
    [studentsQuery.data],
  );
  const subjects = useMemo(
    () => subjectsQuery.data?.results ?? [],
    [subjectsQuery.data],
  );

  const subjectOptions = useMemo(
    () =>
      Array.from(
        new Set(
          [
            ...subjectResults.map((result) => result.subject_name),
            ...examResults.map((result) => result.subject_name),
            ...components.map((component) => component.subject_name),
          ].filter((value): value is string => Boolean(value)),
        ),
      ).sort(),
    [components, examResults, subjectResults],
  );

  const gradeOptions = useMemo(
    () =>
      Array.from(
        new Set(
          subjectResults
            .map((result) => result.grade)
            .filter((value): value is string => Boolean(value)),
        ),
      ).sort(),
    [subjectResults],
  );

  const filteredSubjectResults = useMemo(() => {
    const term = search.trim().toLowerCase();
    return subjectResults.filter((result) => {
      const matchesSearch =
        !term ||
        result.student_name?.toLowerCase().includes(term) ||
        result.enrollment_number?.toLowerCase().includes(term) ||
        result.subject_name?.toLowerCase().includes(term);
      const matchesSubject =
        subject === "all" || result.subject_name === subject;
      const matchesGrade = grade === "all" || result.grade === grade;
      return matchesSearch && matchesSubject && matchesGrade;
    });
  }, [grade, search, subject, subjectResults]);

  const filteredExamResults = useMemo(() => {
    const term = search.trim().toLowerCase();
    return examResults.filter((result) => {
      const matchesSearch =
        !term ||
        result.student_name.toLowerCase().includes(term) ||
        result.enrollment_number.toLowerCase().includes(term) ||
        result.subject_name?.toLowerCase().includes(term);
      const matchesSubject =
        subject === "all" || result.subject_name === subject;
      return matchesSearch && matchesSubject;
    });
  }, [examResults, search, subject]);

  const filteredComponents = useMemo(() => {
    const term = search.trim().toLowerCase();
    return components.filter((component) => {
      const matchesSearch =
        !term ||
        component.name.toLowerCase().includes(term) ||
        component.subject_name.toLowerCase().includes(term) ||
        component.batch_name.toLowerCase().includes(term);
      const matchesSubject =
        subject === "all" || component.subject_name === subject;
      return matchesSearch && matchesSubject;
    });
  }, [components, search, subject]);

  const averageMarks = subjectResults.length
    ? subjectResults.reduce((sum, result) => sum + result.total_marks, 0) /
      subjectResults.length
    : 0;
  const passedResults = subjectResults.filter(
    (result) => result.grade && result.grade.toUpperCase() !== "F",
  ).length;
  const passRate = subjectResults.length
    ? (passedResults / subjectResults.length) * 100
    : 0;
  const unpublishedExams = exams.filter((exam) => !exam.is_published).length;

  return (
    <main className="space-y-6">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium text-[#E86C0D]">
            {scope === "hod" ? "Department academics" : "Institution academics"}
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
            variant="outline"
            className="rounded-xl"
            onClick={() => setBulkOpen(true)}
          >
            <FileUp className="size-4" />
            Bulk scores
          </Button>
          <Button
            variant="outline"
            className="rounded-xl"
            onClick={() => setComputeOpen(true)}
          >
            <Calculator className="size-4" />
            Compute result
          </Button>
          <Button
            className="rounded-xl bg-[#0F172A]"
            onClick={() => setPublishOpen(true)}
          >
            <Send className="size-4" />
            Publish results
          </Button>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryTile
          icon={GraduationCap}
          label="Result records"
          value={String(subjectResultsQuery.data?.count ?? subjectResults.length)}
          meta={`${scoresQuery.data?.count ?? 0} component scores`}
        />
        <SummaryTile
          icon={TrendingUp}
          label="Average marks"
          value={`${averageMarks.toFixed(1)}%`}
          meta="Across computed results"
        />
        <SummaryTile
          icon={CheckCircle2}
          label="Pass rate"
          value={`${passRate.toFixed(1)}%`}
          meta={`${passedResults} passing results`}
        />
        <SummaryTile
          icon={Send}
          label="Awaiting publication"
          value={String(unpublishedExams)}
          meta={`${exams.length} exams configured`}
          accent={unpublishedExams > 0}
        />
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-[minmax(240px,1fr)_220px_180px_auto]">
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search student, enrollment or subject"
            className="h-10 rounded-xl border-slate-200 bg-slate-50"
          />
          <Select value={subject} onValueChange={setSubject}>
            <SelectTrigger className="h-10 rounded-xl border-slate-200 bg-slate-50">
              <SelectValue placeholder="Subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All subjects</SelectItem>
              {subjectOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={grade} onValueChange={setGrade}>
            <SelectTrigger className="h-10 rounded-xl border-slate-200 bg-slate-50">
              <SelectValue placeholder="Grade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All grades</SelectItem>
              {gradeOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  Grade {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            type="button"
            variant="outline"
            className="h-10 rounded-xl"
            onClick={() => {
              setSearch("");
              setSubject("all");
              setGrade("all");
            }}
          >
            Reset
          </Button>
        </div>
      </section>

      <Tabs defaultValue="final-results" className="space-y-4">
        <TabsList className="h-auto rounded-xl bg-slate-100 p-1">
          <TabsTrigger value="final-results" className="rounded-lg">
            Final results
          </TabsTrigger>
          <TabsTrigger value="exam-scores" className="rounded-lg">
            Exam scores
          </TabsTrigger>
          <TabsTrigger value="components" className="rounded-lg">
            Components
          </TabsTrigger>
        </TabsList>
        <TabsContent value="final-results">
          <SubjectResultsTable
            rows={filteredSubjectResults}
            isLoading={subjectResultsQuery.isLoading}
          />
        </TabsContent>
        <TabsContent value="exam-scores">
          <ExamScoresTable
            rows={filteredExamResults}
            isLoading={examResultsQuery.isLoading}
          />
        </TabsContent>
        <TabsContent value="components">
          <ComponentsTable
            rows={filteredComponents}
            isLoading={componentsQuery.isLoading}
          />
        </TabsContent>
      </Tabs>

      <BulkScoreUploadDialog
        open={bulkOpen}
        components={components}
        onOpenChange={setBulkOpen}
      />
      <ComputeResultDialog
        open={computeOpen}
        students={students}
        subjects={subjects}
        onOpenChange={setComputeOpen}
      />
      <PublishResultsDialog
        open={publishOpen}
        exams={exams}
        onOpenChange={setPublishOpen}
      />
    </main>
  );
}

interface SummaryTileProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  meta: string;
  accent?: boolean;
}

function SummaryTile({
  icon: Icon,
  label,
  value,
  meta,
  accent = false,
}: SummaryTileProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-[#0F172A]">{value}</p>
        </div>
        <span
          className={
            accent
              ? "inline-flex size-10 items-center justify-center rounded-xl bg-[#FFF0E8] text-[#E86C0D]"
              : "inline-flex size-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600"
          }
        >
          <Icon className="size-5" />
        </span>
      </div>
      <p className="mt-3 text-xs text-slate-500">{meta}</p>
    </div>
  );
}
