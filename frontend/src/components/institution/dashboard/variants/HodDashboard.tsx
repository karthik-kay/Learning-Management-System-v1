"use client";

import {
  useInstitutionBatches,
  useInstitutionDepartments,
  useInstitutionHodDashboard,
  useInstitutionPrograms,
  useInstitutionSections,
  useInstitutionSubjects,
} from "@/hooks/queries/institution";
import type { PaginatedResponse } from "@/types/institution";

import { InstitutionDashboardView } from "../InstitutionDashboardView";
import { buildInstitutionHierarchy } from "../widgets/hierarchy/institution-tree";

function pageItems<T>(page?: PaginatedResponse<T>) {
  return page?.results ?? [];
}

function countLabel(value: number | undefined) {
  return typeof value === "number" ? value.toLocaleString("en-IN") : "N/A";
}

function percentLabel(value: number | undefined) {
  return typeof value === "number" ? `${value}%` : "N/A";
}

export function HodDashboard() {
  const dashboard = useInstitutionHodDashboard();
  const departments = useInstitutionDepartments();
  const programs = useInstitutionPrograms();
  const batches = useInstitutionBatches();
  const sections = useInstitutionSections();
  const subjects = useInstitutionSubjects();

  const data = dashboard.data;
  const departmentItems = pageItems(departments.data).filter(
    (department) => !data?.department || department.name === data.department,
  );
  const programItems = pageItems(programs.data).filter(
    (program) => !data?.department || program.department_name === data.department,
  );
  const subjectItems = pageItems(subjects.data).filter((subject) =>
    programItems.some((program) => program.name === subject.program_name),
  );
  const hierarchy = buildInstitutionHierarchy({
    departments: departmentItems,
    programs: programItems,
    batches: pageItems(batches.data),
    sections: pageItems(sections.data),
    subjects: subjectItems,
    rootLabel: "Department scope",
    rootMeta: data?.department ?? "Live hierarchy",
    fallbackDepartmentName: data?.department,
  });

  return (
    <InstitutionDashboardView
      eyebrow="Department workspace"
      title="Keep your department on track without institution-wide noise."
      description="Review department students, faculty workload, attendance shortages, pending marks, leave approvals and upcoming classes."
      scopeLabel={
        data?.department ? `${data.department} scope` : "Department scoped view"
      }
      primaryAction={{
        label: "Review department",
        href: "/institution/students",
      }}
      metrics={[
        {
          label: "Department students",
          value: countLabel(data?.total_students),
          helper: data?.department ?? "Students mapped to your department",
          tone: "teal",
        },
        {
          label: "Today attendance",
          value: percentLabel(data?.today_attendance_percentage),
          helper: "Attendance recorded today",
          tone: "blue",
        },
        {
          label: "Shortage count",
          value: countLabel(data?.shortage_count),
          helper: "Students below attendance threshold",
          tone: "rose",
        },
        {
          label: "Pending marks",
          value: countLabel(data?.pending_marks_entry),
          helper: "Subjects awaiting grade submission",
          tone: "orange",
        },
        {
          label: "Upcoming exams",
          value: countLabel(data?.upcoming_exams),
          helper: "Scheduled in the next 7 days",
          tone: "teal",
        },
      ]}
      hierarchySummary={hierarchy.summary}
      hierarchyTree={hierarchy.tree}
      queues={[
        {
          title: "Leave approvals",
          meta: "Pending leave approvals from HOD dashboard",
          count: countLabel(data?.pending_leave_approvals),
          href: "/institution/leave",
          tone: "orange",
        },
        {
          title: "Low attendance",
          meta: "Department students below attendance threshold",
          count: countLabel(data?.shortage_count),
          href: "/institution/attendance",
          tone: "rose",
        },
        {
          title: "Marks pending",
          meta: "Pending marks entry from HOD dashboard",
          count: countLabel(data?.pending_marks_entry),
          href: "/institution/grades",
          tone: "blue",
        },
        {
          title: "Internship approvals",
          meta: "Deferred feature, count returned by backend for later use",
          count: countLabel(data?.pending_internship_approvals),
          href: "/institution/reports",
          tone: "teal",
        },
      ]}
      classes={[
        {
          time: "N/A",
          title: "Upcoming department classes",
          meta: "Timetable summary is not included in the HOD dashboard endpoint yet.",
          status: "N/A",
        },
      ]}
      risks={[
        {
          name: "Attendance shortage",
          detail: `${countLabel(data?.shortage_count)} students below the configured attendance threshold.`,
          severity: data?.shortage_count ? "High" : "Low",
        },
        {
          name: "Pending marks",
          detail: `${countLabel(data?.pending_marks_entry)} subjects awaiting grade entry.`,
          severity: data?.pending_marks_entry ? "Medium" : "Low",
        },
      ]}
      activities={[
        {
          title:
            "Recent department activity feed is not included in the dashboard endpoint yet.",
          time: "N/A",
          tone: "slate",
        },
      ]}
    />
  );
}

