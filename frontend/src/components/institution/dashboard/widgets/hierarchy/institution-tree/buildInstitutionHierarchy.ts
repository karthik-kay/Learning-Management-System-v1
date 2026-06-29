import type {
  AcademicBatch,
  Department,
  Program,
  Section,
  Subject,
} from "@/types/institution";

import type { HierarchyNode, HierarchySummaryItem } from "./types";

function countLabel(value: number | undefined) {
  return typeof value === "number" ? value.toLocaleString("en-IN") : "N/A";
}

interface BuildHierarchyArgs {
  departments: Department[];
  programs: Program[];
  batches: AcademicBatch[];
  sections: Section[];
  subjects: Subject[];
  rootLabel: string;
  rootMeta?: string;
  fallbackDepartmentName?: string;
}

export function buildInstitutionHierarchy({
  departments,
  programs,
  batches,
  sections,
  subjects,
  rootLabel,
  rootMeta = "Live hierarchy",
  fallbackDepartmentName,
}: BuildHierarchyArgs): {
  summary: HierarchySummaryItem[];
  tree: HierarchyNode[];
} {
  const departmentNodes =
    departments.length > 0
      ? departments.map((department) =>
          buildDepartmentNode(department, programs, batches, sections, subjects),
        )
      : fallbackDepartmentName
        ? [
            {
              id: "department-current",
              type: "Department",
              label: fallbackDepartmentName,
              meta: "Current HOD scope",
              href: "/institution/departments",
              details: [
                { label: "Code", value: "N/A" },
                { label: "HOD", value: "N/A" },
                { label: "Programs", value: countLabel(programs.length) },
                { label: "Faculty", value: "N/A" },
                { label: "Students", value: "N/A" },
              ],
              children: programs.map((program) =>
                buildProgramNode(program, batches, sections, subjects),
              ),
            } satisfies HierarchyNode,
          ]
        : [];

  const mappedDepartmentNames = new Set(departments.map((item) => item.name));
  const unmappedPrograms = programs.filter(
    (program) => !mappedDepartmentNames.has(program.department_name),
  );

  if (unmappedPrograms.length && departments.length > 0) {
    departmentNodes.push({
      id: "department-unmapped",
      type: "Department",
      label: "Unmapped programs",
      meta: "N/A",
      href: "/institution/programs",
      details: [
        { label: "Code", value: "N/A" },
        { label: "HOD", value: "N/A" },
        { label: "Programs", value: countLabel(unmappedPrograms.length) },
        { label: "Faculty", value: "N/A" },
        { label: "Students", value: "N/A" },
      ],
      children: unmappedPrograms.map((program) =>
        buildProgramNode(program, batches, sections, subjects),
      ),
    });
  }

  return {
    summary: [
      { label: "Departments", count: countLabel(departmentNodes.length) },
      { label: "Programs", count: countLabel(programs.length) },
      { label: "Batches", count: countLabel(batches.length) },
      { label: "Sections", count: countLabel(sections.length) },
    ],
    tree: [
      {
        id: "hierarchy-root",
        type: "Institution",
        label: rootLabel,
        meta: rootMeta,
        href: "/institution/settings",
        details: [
          { label: "Departments", value: countLabel(departmentNodes.length) },
          { label: "Programs", value: countLabel(programs.length) },
          { label: "Batches", value: countLabel(batches.length) },
          { label: "Sections", value: countLabel(sections.length) },
          { label: "Subjects", value: countLabel(subjects.length) },
        ],
        children: departmentNodes,
      },
    ],
  };
}

function buildDepartmentNode(
  department: Department,
  programs: Program[],
  batches: AcademicBatch[],
  sections: Section[],
  subjects: Subject[],
): HierarchyNode {
  const departmentPrograms = programs.filter(
    (program) => program.department_name === department.name,
  );

  return {
    id: `department-${department.id}`,
    type: "Department",
    label: department.name,
    meta: department.code,
    href: `/institution/departments/${department.id}`,
    details: [
      { label: "Code", value: department.code },
      { label: "HOD", value: department.hod_name ?? "N/A" },
      { label: "Programs", value: countLabel(department.program_count) },
      { label: "Faculty", value: countLabel(department.faculty_count) },
      { label: "Students", value: countLabel(department.student_count) },
    ],
    children: departmentPrograms.map((program) =>
      buildProgramNode(program, batches, sections, subjects),
    ),
  };
}

function buildProgramNode(
  program: Program,
  batches: AcademicBatch[],
  sections: Section[],
  subjects: Subject[],
): HierarchyNode {
  const programBatches = batches.filter(
    (batch) => batch.program_name === program.name,
  );
  const subjectCount = subjects.filter(
    (subject) => subject.program_name === program.name,
  ).length;

  return {
    id: `program-${program.id}`,
    type: "Program",
    label: program.name,
    meta: program.code,
    href: `/institution/programs/${program.id}`,
    details: [
      { label: "Code", value: program.code },
      { label: "Department", value: program.department_name },
      { label: "Degree", value: program.degree_name },
      { label: "Duration", value: `${program.duration_semesters} semesters` },
      { label: "Intake", value: countLabel(program.intake_capacity) },
      { label: "Subjects", value: countLabel(subjectCount) },
    ],
    children: programBatches.map((batch) => buildBatchNode(batch, sections)),
  };
}

function buildBatchNode(
  batch: AcademicBatch,
  sections: Section[],
): HierarchyNode {
  const batchSections = sections.filter(
    (section) => section.batch_name === batch.name,
  );

  return {
    id: `batch-${batch.id}`,
    type: "Batch",
    label: batch.name,
    meta: `${batch.start_year} - ${batch.end_year}`,
    href: `/institution/batches/${batch.id}`,
    details: [
      { label: "Program", value: batch.program_name },
      { label: "Start year", value: String(batch.start_year) },
      { label: "End year", value: String(batch.end_year) },
      { label: "Semester", value: countLabel(batch.current_semester) },
      { label: "Status", value: batch.status },
      { label: "Intake", value: countLabel(batch.intake_size) },
    ],
    children: batchSections.map((section) => buildSectionNode(section)),
  };
}

function buildSectionNode(section: Section): HierarchyNode {
  return {
    id: `section-${section.id}`,
    type: "Section",
    label: section.name,
    meta: section.batch_name,
    href: `/institution/sections/${section.id}`,
    details: [
      { label: "Batch", value: section.batch_name },
      { label: "Class teacher", value: section.class_teacher_name ?? "N/A" },
      { label: "Capacity", value: countLabel(section.capacity) },
    ],
  };
}
