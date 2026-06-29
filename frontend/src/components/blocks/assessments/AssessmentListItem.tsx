// components/student/assessments/tests/AssessmentCard.tsx
import { Clock, ListChecks, User } from "lucide-react";

interface Props {
  title: string;
  course: string;
  module: string;
  instructor: string;
  duration: string;
  questions: number;
  level: string;
}

export const AssessmentListItem = ({
  title,
  course,
  module,
  instructor,
  duration,
  questions,
  level,
}: Props) => {
  return (
    <div className="flex flex-col justify-between p-5 bg-white border border-slate-200 rounded-2xl hover:shadow-sm transition">
      <div>
        <h4 className="text-sm font-semibold text-slate-900 line-clamp-2">
          {title}
        </h4>

        <p className="text-xs text-slate-500 mt-1 line-clamp-1">
          {course} • {module}
        </p>

        <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700">
          {level}
        </span>

        <div className="flex items-center gap-4 mt-3 text-sm text-slate-500">
          <span className="flex items-center gap-1">
            <Clock size={12} /> {duration}
          </span>
          <span className="flex items-center gap-1">
            <ListChecks size={12} /> {questions} Qs
          </span>
          <span className="flex items-center gap-1">
            <User size={12} />
            {instructor}
          </span>
        </div>
      </div>

      <button className="mt-4 py-2 text-xs font-medium text-white rounded-lg bg-indigo-600 hover:bg-indigo-700 transition">
        Start Assessment
      </button>
    </div>
  );
};
