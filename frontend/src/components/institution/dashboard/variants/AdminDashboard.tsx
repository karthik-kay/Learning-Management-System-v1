"use client";

import {
  useInstitutionAdminDashboard,
  useInstitutionBatches,
  useInstitutionDepartments,
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

export default function AdminDashboard() {
  const dashboard = useInstitutionAdminDashboard();
  const departments = useInstitutionDepartments();
  const programs = useInstitutionPrograms();
  const batches = useInstitutionBatches();
  const sections = useInstitutionSections();
  const subjects = useInstitutionSubjects();

  const data = dashboard.data;
  const hierarchy = buildInstitutionHierarchy({
    departments: pageItems(departments.data),
    programs: pageItems(programs.data),
    batches: pageItems(batches.data),
    sections: pageItems(sections.data),
    subjects: pageItems(subjects.data),
    rootLabel: "Institution",
  });

  return (
    <InstitutionDashboardView
      eyebrow="Institution command center"
      title="Run academics, people and operations from one place."
      description="Track institution-wide attendance, faculty workload, departments, batches, pending approvals and recent operational activity."
      scopeLabel="Institution-wide view"
      primaryAction={{
        label: "Review students",
        href: "/institution/students",
      }}
      metrics={[
        {
          label: "Active students",
          value: countLabel(data?.total_students),
          helper: "Across all programs, batches and sections",
          tone: "teal",
        },
        {
          label: "Faculty members",
          value: countLabel(data?.total_faculty),
          helper: "Teaching, mentoring and lab support staff",
          tone: "blue",
        },
        {
          label: "Departments",
          value: countLabel(data?.total_departments),
          helper: "Active institution departments",
          tone: "orange",
        },
        {
          label: "Avg attendance",
          value: percentLabel(data?.avg_attendance),
          helper: "Current academic cycle average",
          tone: "teal",
        },
        {
          label: "At-risk students",
          value: countLabel(data?.at_risk_students),
          helper: "Below configured attendance threshold",
          tone: "rose",
        },
      ]}
      hierarchySummary={hierarchy.summary}
      hierarchyTree={hierarchy.tree}
      queues={[
        {
          title: "Leave approvals",
          meta: "Endpoint not loaded in dashboard yet",
          count: "N/A",
          href: "/institution/leave",
          tone: "orange",
        },
        {
          title: "Attendance exceptions",
          meta: "At-risk students from backend dashboard",
          count: countLabel(data?.at_risk_students),
          href: "/institution/attendance",
          tone: "rose",
        },
        {
          title: "Pending certifications",
          meta: "Certification requests awaiting issue/review",
          count: countLabel(data?.pending_certifications),
          href: "/institution/certifications",
          tone: "blue",
        },
        {
          title: "Export jobs",
          meta: "Async export count not included in dashboard endpoint",
          count: "N/A",
          href: "/institution/exports",
          tone: "teal",
        },
      ]}
      classes={[
        {
          time: "N/A",
          title: "Upcoming classes",
          meta: "Timetable summary is not included in the dashboard endpoint yet.",
          status: "N/A",
        },
      ]}
      risks={[
        {
          name: "At-risk students",
          detail: `${countLabel(data?.at_risk_students)} students below the configured attendance threshold.`,
          severity: data?.at_risk_students ? "High" : "Low",
        },
        {
          name: "Performance average",
          detail: `Average marks/performance: ${percentLabel(data?.avg_performance)}.`,
          severity: "Medium",
        },
      ]}
      activities={[
        {
          title: "Recent activity feed is not included in the dashboard endpoint yet.",
          time: "N/A",
          tone: "slate",
        },
      ]}
    />
  );
}

