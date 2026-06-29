"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { PlayCircle, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

import { ContinueCourseItem } from "@/types";

import { fetchContinueCourses } from "@/redux/slices/courseContinueSlice";
import { ContinueLearningCard } from "../../../../blocks/student/ContinueLearningCard";

export default function ContinueLearningSection() {
  const dispatch = useDispatch<AppDispatch>();

  const { activeCourses: ongoing, status } = useSelector(
    (state: RootState) => state.courseContinue
  );

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchContinueCourses());
    }
  }, [status, dispatch]);

  return (
    <section className="bg-slate-50/50 rounded-2xl border border-slate-200 overflow-hidden">
      {/* HEADER */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
        <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-2.5">
          <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
            <PlayCircle className="h-4 w-4" />
          </div>
          Continue Learning
        </h2>

        {ongoing.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 text-xs font-medium"
          >
            View Schedule
          </Button>
        )}
      </div>

      {/* CONTENT */}
      <div className="px-4 py-4">
        {status === "loading" && (
          <div className="p-8 flex justify-center">
            <div className="h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {status === "succeeded" && ongoing.length === 0 && (
          <div className="p-8 text-center flex flex-col items-center bg-white rounded-xl border border-slate-100">
            <BookOpen className="h-10 w-10 text-slate-200 mb-3" />
            <p className="text-sm font-medium text-slate-500">
              No courses in progress. Time to start a new one!
            </p>
          </div>
        )}

        {status === "succeeded" && ongoing.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {ongoing.map((course: ContinueCourseItem) => (
              <div
                key={course.course_id}
                className="group relative transition-all"
              >
                <ContinueLearningCard {...course} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
