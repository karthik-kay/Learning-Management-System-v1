"use client";

import { useEffect } from "react";
import { Award, Clock, ChevronRight, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchQuizHistory } from "@/redux/slices/assessmentSlice";
import { QuizAttempt } from "@/types";

// KEEP COLORFUL DONUT
const getScoreStyles = (percent: number) => {
  if (percent >= 85)
    return {
      text: "text-emerald-600",
      stroke: "stroke-emerald-500",
    };
  if (percent >= 70)
    return {
      text: "text-blue-600",
      stroke: "stroke-blue-500",
    };
  if (percent >= 60)
    return {
      text: "text-amber-600",
      stroke: "stroke-amber-500",
    };
  return {
    text: "text-rose-600",
    stroke: "stroke-rose-500",
  };
};

export default function RecentAssessments() {
  const dispatch = useAppDispatch();
  const { recent, loading } = useAppSelector((state) => state.assessments);

  useEffect(() => {
    dispatch(fetchQuizHistory());
  }, [dispatch]);

  return (
    <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      {/* HEADER */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
          <Award className="h-4 w-4 text-slate-500" />
          Recent assessments
        </h2>

        <Button
          variant="ghost"
          size="sm"
          className="text-slate-500 hover:text-slate-700 text-xs"
        >
          Analytics
        </Button>
      </div>

      {/* CONTENT */}
      <div className="divide-y divide-slate-100">
        {loading ? (
          <div className="p-8 text-center text-sm text-slate-400">
            Loading results…
          </div>
        ) : recent.length === 0 ? (
          <div className="p-8 text-center">
            <BarChart3 className="h-8 w-8 text-slate-200 mx-auto mb-2" />
            <p className="text-sm text-slate-500">
              No assessments attempted yet.
            </p>
          </div>
        ) : (
          recent.map((attempt: QuizAttempt) => {
            const percent =
              attempt.max_score > 0
                ? Math.round((attempt.score / attempt.max_score) * 100)
                : 0;

            const styles = getScoreStyles(percent);

            return (
              <div
                key={attempt.id}
                className="grid grid-cols-[1fr_64px_auto_20px] items-center gap-8 px-6 py-5 hover:bg-slate-50 transition cursor-pointer"
              >
                {/* LEFT */}
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">
                    {attempt.quiz_title}
                  </p>

                  <div className="mt-1.5 flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {attempt.started_at
                        ? new Date(attempt.started_at).toLocaleDateString()
                        : "—"}
                    </span>

                    <span>•</span>

                    <span>
                      {attempt.score}/{attempt.max_score} pts
                    </span>
                  </div>
                </div>

                {/* DONUT (BIGGER + BREATHING ROOM) */}
                <div className="flex justify-center">
                  <div className="relative h-12 w-12">
                    <svg
                      className="h-full w-full -rotate-90"
                      viewBox="0 0 48 48"
                    >
                      <circle
                        cx="24"
                        cy="24"
                        r="20"
                        fill="none"
                        strokeWidth="4.5"
                        className="stroke-slate-200"
                      />
                      <circle
                        cx="24"
                        cy="24"
                        r="20"
                        fill="none"
                        strokeWidth="4.5"
                        strokeDasharray={125.6}
                        strokeDashoffset={125.6 - (125.6 * percent) / 100}
                        strokeLinecap="round"
                        className={`${styles.stroke} transition-all duration-700`}
                      />
                    </svg>

                    <span
                      className={`absolute inset-0 flex items-center justify-center text-xs font-semibold ${styles.text}`}
                    >
                      {percent}%
                    </span>
                  </div>
                </div>

                {/* BUTTON */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden sm:flex text-slate-500 hover:text-slate-700 text-xs"
                >
                  Review
                </Button>

                {/* CHEVRON */}
                <ChevronRight className="h-4 w-4 text-slate-300" />
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
