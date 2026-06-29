"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  FileCheck,
  Award,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Code,
  FileText,
  LucideIcon,
  Ticket,
} from "lucide-react";

import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";

interface NavItem {
  name: string;
  href?: string;
  action?: string;
  icon: LucideIcon;
}

interface StudentSidebarProps {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
}

export default function StudentSidebar({
  collapsed,
  setCollapsed,
}: StudentSidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();

  const mainNav: NavItem[] = [
    { name: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
    { name: "Courses", href: "/student/courses", icon: BookOpen },
    { name: "Community", href: "/student/community", icon: Users },
  ];

  const learningNav = [
    { name: "IDE", href: "/student/ide", icon: Code },
    { name: "Assessments", href: "/student/assessments", icon: FileCheck },
    { name: "Certificates", href: "/student/certificates", icon: Award },
    { name: "Notes", href: "/student/notes", icon: FileText },
    { name: "Tickets", href: "/student/tickets", icon: Ticket },
  ];

  const bottomItems = [
    { name: "Settings", href: "/student/settings", icon: Settings },
    { name: "Log out", action: "logout", icon: LogOut },
  ];

  const renderNavItem = (item: NavItem) => {
    const active = item.href ? pathname.startsWith(item.href) : false;
    const Icon = item.icon;

    return (
      <Tooltip key={item.name} delayDuration={150}>
        <TooltipTrigger asChild>
          <li>
            <Link
              href={item.href || "#"}
              className={`
                relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition
                ${
                  active
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-slate-600 hover:bg-gray-100 hover:text-slate-900"
                }
              `}
            >
              <Icon
                className={`h-5 w-5 shrink-0 ${
                  active ? "text-blue-700" : "text-slate-500"
                }`}
              />
              {!collapsed && <span>{item.name}</span>}
              {active && (
                <span className="absolute right-0 top-0 h-full w-[3px] bg-blue-600 rounded-l-md" />
              )}
            </Link>
          </li>
        </TooltipTrigger>
        {collapsed && <TooltipContent side="right">{item.name}</TooltipContent>}
      </Tooltip>
    );
  };

  return (
    <TooltipProvider>
      <div className="flex flex-col h-full bg-gradient-to-b from-white to-slate-50 border-r border-slate-100">
        {/* HEADER */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-slate-100">
          {!collapsed && (
            <div>
              <h1>Welcome Back!</h1>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* BODY */}
        <div className="flex flex-1 flex-col justify-between overflow-y-auto py-4">
          <nav className="px-3 space-y-6">
            {/* MAIN */}
            <div>
              {!collapsed && (
                <p className="text-[10px] font-semibold text-slate-400 px-2 mb-2 tracking-widest">
                  MAIN
                </p>
              )}
              <ul className="space-y-1">
                {mainNav.map((item) => {
                  const active = item.href
                    ? pathname.startsWith(item.href)
                    : false;
                  const Icon = item.icon;

                  return (
                    <Tooltip key={item.name} delayDuration={150}>
                      <TooltipTrigger asChild>
                        <li>
                          <Link
                            href={item.href || "#"}
                            className={`
                            group relative flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all
                            ${
                              active
                                ? "bg-blue-50 text-blue-700 shadow-sm"
                                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                            }
                          `}
                          >
                            <div
                              className={`
                              flex items-center justify-center w-8 h-8 rounded-lg transition
                              ${
                                active
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                              }
                            `}
                            >
                              <Icon className="w-4 h-4" />
                            </div>

                            {!collapsed && <span>{item.name}</span>}

                            {/* active glow bar */}
                            {active && (
                              <span className="absolute inset-y-1 left-0 w-[3px] bg-blue-600 rounded-r-md" />
                            )}
                          </Link>
                        </li>
                      </TooltipTrigger>
                      {collapsed && (
                        <TooltipContent side="right">
                          {item.name}
                        </TooltipContent>
                      )}
                    </Tooltip>
                  );
                })}
              </ul>
            </div>

            {/* LEARNING */}
            <div>
              {!collapsed && (
                <p className="text-[10px] font-semibold text-slate-400 px-2 mb-2 tracking-widest">
                  LEARNING
                </p>
              )}
              <ul className="space-y-1">
                {learningNav.map((item) => {
                  const active = item.href
                    ? pathname.startsWith(item.href)
                    : false;
                  const Icon = item.icon;

                  return (
                    <Tooltip key={item.name} delayDuration={150}>
                      <TooltipTrigger asChild>
                        <li>
                          <Link
                            href={item.href || "#"}
                            className={`
                            group flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all
                            ${
                              active
                                ? "bg-blue-50 text-blue-700 shadow-sm"
                                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                            }
                          `}
                          >
                            <div
                              className={`
                              flex items-center justify-center w-8 h-8 rounded-lg transition
                              ${
                                active
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                              }
                            `}
                            >
                              <Icon className="w-4 h-4" />
                            </div>

                            {!collapsed && <span>{item.name}</span>}
                          </Link>
                        </li>
                      </TooltipTrigger>
                      {collapsed && (
                        <TooltipContent side="right">
                          {item.name}
                        </TooltipContent>
                      )}
                    </Tooltip>
                  );
                })}
              </ul>
            </div>
          </nav>

          {/* BOTTOM */}
          <div className="px-3 mt-auto pt-4 border-t border-slate-100">
            <ul className="space-y-1">
              {bottomItems.map((item) => {
                const Icon = item.icon;

                if (item.action === "logout") {
                  return (
                    <li key={item.name}>
                      <button
                        onClick={() => logout()}
                        className="group flex w-full items-center gap-3 px-3 py-2 rounded-xl text-sm text-slate-600 hover:text-red-600 hover:bg-red-50 transition"
                      >
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-slate-500 group-hover:bg-red-100 group-hover:text-red-600">
                          <Icon className="w-4 h-4" />
                        </div>
                        {!collapsed && <span>{item.name}</span>}
                      </button>
                    </li>
                  );
                }

                return renderNavItem(item);
              })}
            </ul>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
