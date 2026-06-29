import { Target, CheckCircle } from "lucide-react";

export function GoalCardPreview({ goal }) {
  const isDone = goal.completed;
  const percent = Math.round((goal.progress / goal.target) * 100);

  return (
    <div className="flex flex-col gap-2 w-full ">
      <div className="flex justify-between items-center">
        <div>
          <p className="font-semibold text-gray-900">{goal.title}</p>
          <p className="text-xs text-gray-500">{percent}% complete</p>
        </div>

        {isDone ? (
          <CheckCircle className="text-green-600 w-5 h-5" />
        ) : (
          <Target className="text-indigo-600 w-5 h-5" />
        )}
      </div>

      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-600 transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

import { Calendar } from "lucide-react";
import { useDispatch } from "react-redux";
import { checkInGoal } from "@/redux/slices/goalsSlice";
import { AppDispatch } from "@/redux/store";

export function GoalCardExpanded({ goal }) {
  const dispatch = useDispatch<AppDispatch>();

  const isHabit = goal.goal_type === "habit";
  return (
    <div className="flex flex-col gap-3 pt-2">
      {goal.deadline && (
        <p className="text-xs text-gray-500 flex items-center gap-1">
          <Calendar className="w-3 h-3" /> Due {goal.deadline}
        </p>
      )}

      {isHabit ? (
        <button
          disabled={
            goal.last_checkin_date === new Date().toISOString().split("T")[0]
          }
          onClick={() => dispatch(checkInGoal(goal.id))}
          className="px-3 py-1 text-xs rounded-md bg-indigo-600 text-white disabled:bg-gray-300"
        >
          Check In
        </button>
      ) : (
        <p className="text-xs text-gray-500">
          {goal.progress}/{goal.target} completed
        </p>
      )}
    </div>
  );
}
