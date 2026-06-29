"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Stack, Inline, Box, Divider } from "@/components/shared/primitives";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Award,
  Bell,
  Building2,
  CalendarDays,
  History,
  Settings,
  LayoutDashboard,
  Users,
  BookOpen,
  GraduationCap,
  ClipboardCheck,
  Trophy,
  Calendar,
  Terminal,
  Target,
  FileText,
  FolderOpen,
  Layers3,
  Megaphone,
  MessageSquare,
  School,
  UserCheck,
  Video,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  dashboard: LayoutDashboard,
  users: Users,
  students: GraduationCap,
  courses: BookOpen,
  assessments: ClipboardCheck,
  attendance: UserCheck,
  audit: History,
  batches: Layers3,
  bell: Bell,
  building: Building2,
  calendarDays: CalendarDays,
  certifications: Award,
  community: MessageSquare,
  departments: Building2,
  exams: FileText,
  exports: FileText,
  faculty: Users,
  folder: FolderOpen,
  grades: Trophy,
  calendar: Calendar,
  notifications: Megaphone,
  programs: School,
  resources: FolderOpen,
  terminal: Terminal,
  target: Target,
  reports: FileText,
  sections: Layers3,
  settings: Settings,
  video: Video,
};

export type NavLink = {
  href: string;
  label: string;
  icon: keyof typeof ICONS;
};

export type NavGroup = {
  label: string;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  links: NavLink[];
};

type SharedSidebarProps = {
  groups: NavGroup[];
};

export function SharedSidebar({ groups }: SharedSidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <Stack
      grow
      justify="start"
      gap={0}
      // Added 'relative' here so we can absolute-position the toggle button
      className={`relative h-screen transition-all duration-300 ease-in-out border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* REDDIT-STYLE MIDDLE TOGGLE BUTTON */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-1/2 z-50 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800 dark:hover:text-white"
        title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* HEADER */}
      <Inline
        align="center"
        justify={isCollapsed ? "center" : "start"}
        className="h-14 px-4 border-b border-slate-200 dark:border-slate-800"
      >
        {/* We use a blue dot or minimal icon when collapsed to keep the branding */}
        {isCollapsed ? (
          <div className="h-6 w-6 rounded bg-blue-600 dark:bg-blue-500" />
        ) : (
          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white truncate">
            Vaarada LMS
          </span>
        )}
      </Inline>

      {/* NAV */}
      <Box scroll="y" grow className={isCollapsed ? "p-2" : "p-4"}>
        <Stack gap={isCollapsed ? 8 : 24} justify="start">
          {groups.map((group) => {
            // --- COLLAPSED STATE: Render flat icons only ---
            if (isCollapsed) {
              return (
                <Stack
                  key={group.label}
                  gap={4}
                  justify="start"
                  className="w-full border-b border-slate-100 dark:border-slate-800/50 pb-2 last:border-0 last:pb-0"
                >
                  {group.links.map((link) => {
                    const isActive = pathname.startsWith(link.href);
                    const Icon = ICONS[link.icon];

                    return (
                      <Link key={link.href} href={link.href} title={link.label}>
                        <Inline
                          align="center"
                          justify="center"
                          className={`rounded-md w-10 h-10 mx-auto transition-colors ${
                            isActive
                              ? "bg-slate-100 text-blue-600 dark:bg-slate-800 dark:text-blue-400"
                              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white"
                          }`}
                        >
                          <Icon size={20} />
                        </Inline>
                      </Link>
                    );
                  })}
                </Stack>
              );
            }

            // --- EXPANDED STATE: Render normal accordions ---
            const groupContent = (
              <Stack gap={4} justify="start">
                {group.links.map((link) => {
                  const isActive = pathname.startsWith(link.href);
                  const Icon = ICONS[link.icon];

                  return (
                    <Link key={link.href} href={link.href}>
                      <Inline
                        align="center"
                        justify="start"
                        gap={12}
                        className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white"
                        }`}
                      >
                        <Icon
                          size={18}
                          className={
                            isActive ? "text-blue-600 dark:text-blue-400" : ""
                          }
                        />
                        <span className="truncate">{link.label}</span>
                      </Inline>
                    </Link>
                  );
                })}
              </Stack>
            );

            if (group.collapsible) {
              return (
                <Collapsible
                  key={group.label}
                  defaultOpen={group.defaultExpanded ?? true}
                  className="w-full"
                >
                  <Stack gap={8} justify="start">
                    <CollapsibleTrigger className="group flex w-full items-center justify-between px-3 transition-opacity hover:opacity-80">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        {group.label}
                      </span>
                      <ChevronDown className="h-4 w-4 text-slate-400 transition-transform duration-200 group-data-[state=closed]:-rotate-90" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down overflow-hidden">
                      {groupContent}
                    </CollapsibleContent>
                  </Stack>
                </Collapsible>
              );
            }

            return (
              <Stack key={group.label} gap={8} justify="start">
                <span className="px-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {group.label}
                </span>
                {groupContent}
              </Stack>
            );
          })}
        </Stack>
      </Box>

      {/* FOOTER */}
      <Box>
        <Divider />
        <Stack
          gap={isCollapsed ? 2 : 4}
          justify="start"
          className={isCollapsed ? "p-2" : "p-4"}
        >
          {/* Audit Log */}
          <Link href="/institution/audit" title="Audit Log">
            <Inline
              align="center"
              justify={isCollapsed ? "center" : "start"}
              gap={isCollapsed ? 0 : 12}
              className={`rounded-md transition-colors text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white ${
                isCollapsed
                  ? "w-10 h-10 mx-auto"
                  : "px-3 py-2 text-sm font-medium"
              }`}
            >
              <History size={isCollapsed ? 20 : 18} />
              {!isCollapsed && <span>Audit Log</span>}
            </Inline>
          </Link>

          {/* Settings */}
          <Link href="/institution/settings" title="Settings">
            <Inline
              align="center"
              justify={isCollapsed ? "center" : "start"}
              gap={isCollapsed ? 0 : 12}
              className={`rounded-md transition-colors text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white ${
                isCollapsed
                  ? "w-10 h-10 mx-auto"
                  : "px-3 py-2 text-sm font-medium"
              }`}
            >
              <Settings size={isCollapsed ? 20 : 18} />
              {!isCollapsed && <span>Settings</span>}
            </Inline>
          </Link>
        </Stack>
      </Box>
    </Stack>
  );
}
