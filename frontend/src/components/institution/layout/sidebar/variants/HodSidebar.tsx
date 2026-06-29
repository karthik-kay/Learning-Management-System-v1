import { SharedSidebar, type NavGroup } from "../blocks/SharedSidebar";

const HOD_CONFIG: NavGroup[] = [
  {
    label: "Main",
    links: [
      {
        href: "/institution/dashboard",
        label: "Dashboard",
        icon: "dashboard",
      },
    ],
  },
  {
    label: "Department",
    collapsible: true,
    defaultExpanded: true,
    links: [
      {
        href: "/institution/students",
        label: "Students",
        icon: "students",
      },
      {
        href: "/institution/faculty",
        label: "Faculty",
        icon: "faculty",
      },
    ],
  },
  {
    label: "Structure",
    collapsible: true,
    defaultExpanded: true,
    links: [
      {
        href: "/institution/programs",
        label: "Programs",
        icon: "programs",
      },
      {
        href: "/institution/batches",
        label: "Batches",
        icon: "batches",
      },
      {
        href: "/institution/sections",
        label: "Sections",
        icon: "sections",
      },
    ],
  },
  {
    label: "Academic",
    collapsible: true,
    defaultExpanded: true,
    links: [
      {
        href: "/institution/courses",
        label: "Courses",
        icon: "courses",
      },
      {
        href: "/institution/assessments",
        label: "Assessments",
        icon: "assessments",
      },
      {
        href: "/institution/exams",
        label: "Exams",
        icon: "exams",
      },
      {
        href: "/institution/grades",
        label: "Grades",
        icon: "grades",
      },
      {
        href: "/institution/attendance",
        label: "Attendance",
        icon: "attendance",
      },
      {
        href: "/institution/leave",
        label: "Leave",
        icon: "calendarDays",
      },
      {
        href: "/institution/timetable",
        label: "Timetable",
        icon: "calendar",
      },
      {
        href: "/institution/calendar",
        label: "Calendar",
        icon: "calendarDays",
      },
      {
        href: "/institution/resources",
        label: "Resources",
        icon: "resources",
      },
      {
        href: "/institution/certifications",
        label: "Certifications",
        icon: "certifications",
      },
    ],
  },
  {
    label: "Communication",
    collapsible: true,
    defaultExpanded: false,
    links: [
      {
        href: "/institution/community",
        label: "Community",
        icon: "community",
      },
      {
        href: "/institution/notifications",
        label: "Notifications",
        icon: "notifications",
      },
      {
        href: "/institution/live-classes",
        label: "Live Classes",
        icon: "video",
      },
    ],
  },
  {
    label: "Reports",
    collapsible: true,
    defaultExpanded: false,
    links: [
      {
        href: "/institution/reports",
        label: "Reports",
        icon: "reports",
      },
      {
        href: "/institution/exports",
        label: "Exports",
        icon: "exports",
      },
    ],
  },
];

export function HodSidebar() {
  return <SharedSidebar groups={HOD_CONFIG} />;
}
