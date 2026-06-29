import { Clock, CalendarDays, ListChecks } from "lucide-react";

interface Props {
  title: string;
  courseName: string;
  moduleName: string;
  duration: string;
  totalQuestions: number;
  attemptsLeft: number;
  status: "Active" | "Upcoming" | "Expired";
  dueDate: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  instructor: string;
}
export const ActiveTestListItem = ({
  title,
  courseName,
  moduleName,
  duration,
  totalQuestions,
  attemptsLeft,
  status,
  dueDate,
}: Props) => {
  return (
    <div className="flex items-center justify-between gap-4 p-4 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition">
      {/* Left */}
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-semibold text-slate-900 truncate">
            {title}
          </h4>
          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600">
            {status}
          </span>
        </div>

        <p className="text-[11px] text-slate-500 mt-0.5">
          {courseName} • {moduleName}
        </p>

        <div className="flex items-center gap-4 mt-1 text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <Clock size={12} /> {duration}
          </span>
          <span className="flex items-center gap-1">
            <ListChecks size={12} /> {totalQuestions} Qs
          </span>
          <span className="flex items-center gap-1">
            <CalendarDays size={12} /> Due {dueDate}
          </span>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <span className="text-xs text-slate-500">{attemptsLeft} left</span>
        <button className="text-sm font-medium text-indigo-600 hover:underline">
          Start
        </button>
      </div>
    </div>
  );
};
