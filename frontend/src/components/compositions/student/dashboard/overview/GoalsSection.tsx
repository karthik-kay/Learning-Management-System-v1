"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchGoals } from "@/redux/slices/goalsSlice";

import { Button } from "@/components/ui/button";
import { Target, Plus, Loader2 } from "lucide-react";

import CreateGoalModal from "../modals/CreateGoalModal";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import {
  GoalCardExpanded,
  GoalCardPreview,
} from "../../../../blocks/student/GoalCard";

export default function GoalsSection() {
  const dispatch = useDispatch<AppDispatch>();
  const [open, setOpen] = useState(false);

  const {
    list: goals,
    status,
    error,
  } = useSelector((state: RootState) => state.goals);

  useEffect(() => {
    if (status === "idle") dispatch(fetchGoals());
  }, [dispatch, status]);

  const activeGoals = goals.filter((g) => !g.completed);
  const completedGoals = goals.filter((g) => g.completed);

  return (
    <section className="rounded-2xl border bg-white/70 backdrop-blur p-6 flex flex-col gap-6 ">
      {/* HEADER */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shadow-sm">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Learning Goals
            </h2>
            <p className="text-sm text-gray-500">Your ongoing targets</p>
          </div>
        </div>

        <Button
          onClick={() => setOpen(true)}
          className="flex gap-2 px-4 py-2 rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 transition"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add Goal</span>
        </Button>
      </header>

      {/* STATS */}
      {status === "succeeded" && goals.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-gray-50 py-3 text-center ">
            <p className="text-xl font-semibold text-indigo-600">
              {goals.length}
            </p>
            <p className="text-[11px] text-gray-500 uppercase tracking-wide">
              Total
            </p>
          </div>

          <div className="rounded-xl bg-gray-50 py-3 text-center ">
            <p className="text-xl font-semibold text-green-600">
              {completedGoals.length}
            </p>
            <p className="text-[11px] text-gray-500 uppercase tracking-wide">
              Completed
            </p>
          </div>

          <div className="rounded-xl bg-gray-50 py-3 text-center ">
            <p className="text-xl font-semibold text-gray-900">
              {activeGoals.length}
            </p>
            <p className="text-[11px] text-gray-500 uppercase tracking-wide">
              Active
            </p>
          </div>
        </div>
      )}

      {/* LOADING */}
      {status === "loading" && (
        <div className="flex flex-col items-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-indigo-500 mb-3" />
          <span className="text-gray-600 text-sm">Loading your goals…</span>
        </div>
      )}

      {/* ERROR */}
      {status === "failed" && (
        <div className="text-center py-12 text-red-500">
          <p className="font-medium">Failed to load goals</p>
          <p className="text-sm text-gray-500">{error}</p>
        </div>
      )}

      {/* EMPTY */}
      {status === "succeeded" && goals.length === 0 && (
        <div className="text-center py-12">
          <Target className="h-10 w-10 text-indigo-500 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-900 mb-1">No goals yet</h3>
          <p className="text-sm text-gray-500 mb-4">
            Create your first learning goal to get started.
          </p>

          <Button
            onClick={() => setOpen(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" /> Create Goal
          </Button>
        </div>
      )}

      {/* COLLAPSIBLE GOAL LIST — NO SCROLL */}
      {status === "succeeded" && goals.length > 0 && (
        <Accordion type="single" collapsible className="w-full space-y-3">
          {goals.map((goal) => (
            <AccordionItem
              key={goal.id}
              value={`goal-${goal.id}`}
              className="border rounded-xl px-4 bg-white"
            >
              <AccordionTrigger className="hover:no-underline py-4 text-left">
                <GoalCardPreview goal={goal} />
              </AccordionTrigger>

              <AccordionContent className="pb-4">
                <GoalCardExpanded goal={goal} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}

      <CreateGoalModal open={open} setOpen={setOpen} />
    </section>
  );
}
