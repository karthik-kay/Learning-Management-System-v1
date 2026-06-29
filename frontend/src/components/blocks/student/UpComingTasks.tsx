"use client";

import {
  Calendar,
  Clock,
  FileText,
  Rocket,
  HelpCircle,
  Users,
  Trophy,
  ClipboardList,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const UpcomingTasks = () => {
  const tasks = [
    {
      id: 1,
      title: "Complete React Hooks Assignment",
      course: "Advanced React Development",
      deadline: "Dec 28, 2024",
      daysLeft: 2,
      type: "assignment",
    },
    {
      id: 2,
      title: "Submit JavaScript Final Project",
      course: "JavaScript Fundamentals",
      deadline: "Dec 30, 2024",
      daysLeft: 6,
      type: "project",
    },
    {
      id: 3,
      title: "Take Python Quiz #4",
      course: "Python for Beginners",
      deadline: "Jan 02, 2025",
      daysLeft: 9,
      type: "quiz",
    },
  ];

  const getTypeIcon = (type: string) => {
    const iconClass = "h-4 w-4 text-slate-400";
    switch (type) {
      case "assignment":
        return <FileText className={iconClass} />;
      case "project":
        return <Rocket className={iconClass} />;
      case "quiz":
        return <HelpCircle className={iconClass} />;
      case "review":
        return <Users className={iconClass} />;
      case "challenge":
        return <Trophy className={iconClass} />;
      default:
        return <ClipboardList className={iconClass} />;
    }
  };

  const getUrgency = (daysLeft: number) => {
    if (daysLeft <= 3) return { label: "Due soon", color: "text-red-600" };
    if (daysLeft <= 7)
      return { label: "Due this week", color: "text-amber-600" };
    return { label: "Upcoming", color: "text-slate-400" };
  };

  return (
    <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      {/* HEADER */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
          <Calendar className="h-4 w-4 text-slate-500" />
          Upcoming tasks
        </h2>

        <Button
          variant="ghost"
          size="sm"
          className="text-slate-500 hover:text-slate-700 text-xs"
        >
          View all
        </Button>
      </div>

      {/* LIST */}
      <div className="divide-y divide-slate-100">
        {tasks.map((task) => {
          const urgency = getUrgency(task.daysLeft);

          return (
            <div
              key={task.id}
              className="grid grid-cols-[1fr_auto_20px] items-center gap-6 px-6 py-4 hover:bg-slate-50 transition cursor-pointer"
            >
              {/* LEFT */}
              <div className="flex items-start gap-3 min-w-0">
                <div className="mt-0.5">{getTypeIcon(task.type)}</div>

                <div className="space-y-0.5 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">
                    {task.title}
                  </p>
                  <p className="text-xs text-slate-400 truncate">
                    {task.course}
                  </p>
                </div>
              </div>

              {/* RIGHT META (FIXED WIDTH) */}
              <div className="hidden sm:flex flex-col items-center w-28 ">
                <p className={`text-xs font-medium ${urgency.color}`}>
                  {urgency.label}
                </p>
                <div className="flex items-center gap-1 text-slate-400">
                  <Clock className="h-3 w-3" />
                  <span className="text-xs tabular-nums">{task.deadline}</span>
                </div>
              </div>

              {/* CHEVRON */}
              <ChevronRight className="h-4 w-4 text-slate-300" />
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default UpcomingTasks;
