"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { djangoService } from "@/services/djangoService";
import { AppDispatch, RootState } from "@/redux/store";
import { LessonQueue } from "@/components/compositions/student/dashboard/overview/LessonQueue";

import {
  fetchEnrollments,
  fetchCompletedEnrollments,
} from "@/redux/slices/enrollmentsSlice";
import { fetchContinueCourses } from "@/redux/slices/courseContinueSlice";

import { ScrollArea } from "@/components/ui/scroll-area";
import { EmptyCourses } from "@/components/common/empty-states";

import { ContinueLearningItem } from "@/components/compositions/student/student-course/my-courses/ContinueLearningItem";
import { EnrolledCoursesGrid } from "@/components/compositions/student/student-course/my-courses/EnrolledCoursesGrid";
import { CompletedCoursesList } from "@/components/compositions/student/student-course/my-courses/CompletedCoursesList";

import { LearningDonut } from "@/components/compositions/student/student-course/my-courses/LearningDonut";
import { MonthlyStatsCard } from "@/components/compositions/student/student-course/my-courses/MonthlyStatsCard";

import { LessonQueueItem } from "@/types/learning";
import { ContinueLearningJoinedItem } from "@/types";
import { RecommendationsCarousel } from "@/components/compositions/student/student-course/my-courses/RecommendationCarousel";

import ContinueLearningSection from "@/components/compositions/student/dashboard/my-learning/ContinueLearningSection";

import RecommendedCourses from "@/components/blocks/courses/RecommendedCourses";

export default function MyCoursesPage() {
  const dispatch = useDispatch<AppDispatch>();

  const {
    enrollments,
    completed: completedEnrollments,
    enrollmentsStatus,
    completedStatus,
  } = useSelector((s: RootState) => s.enrollments);

  const { activeCourses: continueCourses, status: continueStatus } =
    useSelector((s: RootState) => s.courseContinue);

  const { monthly } = useSelector((s: RootState) => s.dashboard);

  const [lessonQueue, setLessonQueue] = useState<LessonQueueItem[]>([]);
  const [queueLoading, setQueueLoading] = useState(true);

  const isLoading =
    enrollmentsStatus === "loading" ||
    completedStatus === "loading" ||
    continueStatus === "loading" ||
    queueLoading;

  useEffect(() => {
    if (enrollmentsStatus === "idle") {
      dispatch(fetchEnrollments());
      dispatch(fetchCompletedEnrollments());
      dispatch(fetchContinueCourses());
    }
  }, [dispatch, enrollmentsStatus]);

  useEffect(() => {
    if (queueLoading) {
      djangoService
        .getLessonQueue()
        .then((res) => setLessonQueue(res.queue))
        .catch((error) => console.error("Failed to fetch lesson queue:", error))
        .finally(() => setQueueLoading(false));
    }
  }, [queueLoading]);

  const activeEnrollments = useMemo(
    () => enrollments.filter((e) => !e.is_completed),
    [enrollments],
  );

  const activeEnrollmentByCourseId = useMemo(() => {
    return Object.fromEntries(activeEnrollments.map((e) => [e.course_id, e]));
  }, [activeEnrollments]);

  const continueLearningItems = useMemo(() => {
    const items: ContinueLearningJoinedItem[] = [];

    for (const lesson of lessonQueue) {
      const enrollment = activeEnrollmentByCourseId[lesson.course_id];
      if (!enrollment) continue;

      items.push({
        lesson_id: lesson.id,
        lesson_title: lesson.title,
        module: lesson.module,

        course_id: lesson.course_id,
        course_title: enrollment.course_title,
        course_thumbnail: enrollment.course_thumbnail ?? null,
        course_progress_percent: enrollment.progress,

        lesson_progress_percent: 35,
        duration_minutes: lesson.duration_minutes ?? 0,
      });
    }

    return items;
  }, [lessonQueue, activeEnrollmentByCourseId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-background to-muted/50 p-6">
        <div className="max-w-7xl mx-auto space-y-6 animate-pulse">
          <div className="h-8 w-1/3 bg-muted rounded" />
          <div className="h-40 bg-muted rounded-xl" />
          <div className="h-40 bg-muted rounded-xl" />
        </div>
      </div>
    );
  }

  const inProgressCount = activeEnrollments.length;
  const completedCount = completedEnrollments.length;

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted/50 p-6 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              My Learning Dashboard
            </h1>
            <p className="text-muted-foreground">
              Track progress, stay consistent, and keep leveling up 🚀
            </p>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-12 gap-6">
          {/* LEFT */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            {/* CONTINUE */}
            {continueLearningItems.length > 0 && (
              <div className="bg-background rounded-2xl border p-5 shadow-sm hover:shadow-md transition">
                <h2 className="text-lg font-semibold mb-4">
                  Continue Learning
                </h2>

                <ScrollArea className="pb-2">
                  <div className="grid grid-cols-12 gap-4">
                    {continueLearningItems.map((item) => (
                      <div
                        key={item.lesson_id}
                        className="col-span-12 xl:col-span-6"
                      >
                        <ContinueLearningItem item={item} />
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}

            {/* ENROLLED */}
            <div className="bg-background rounded-2xl border p-5 shadow-sm hover:shadow-md transition">
              <h2 className="text-lg font-semibold mb-4">Enrolled Courses</h2>

              {activeEnrollments.length > 0 ? (
                <EnrolledCoursesGrid courses={continueCourses} />
              ) : (
                <EmptyCourses message="You haven't enrolled in any courses." />
              )}
            </div>

            {/* COMPLETED */}
            <div className="bg-background rounded-2xl border p-5 shadow-sm hover:shadow-md transition">
              <h2 className="text-lg font-semibold mb-4">Completed Courses</h2>

              {completedEnrollments.length > 0 ? (
                <CompletedCoursesList courses={completedEnrollments} />
              ) : (
                <EmptyCourses message="No completed courses yet." />
              )}
            </div>

            {/* RECOMMENDATIONS */}
            <div className="bg-background rounded-2xl border p-5 shadow-sm hover:shadow-md transition">
              <RecommendationsCarousel
                courses={[
                  {
                    id: 101,
                    title: "Advanced React Patterns & Performance",
                    thumbnail: "/images/react.jpg",
                    category: "Development",
                    rating: 4.8,
                    hours: 12,
                  },
                  {
                    id: 102,
                    title: "UI/UX Design Systems in Figma",
                    thumbnail: "/images/design.jpg",
                    category: "Design",
                    rating: 4.7,
                    hours: 9,
                  },
                  {
                    id: 103,
                    title: "Python for Data Science & ML",
                    thumbnail: "/images/python.jpg",
                    category: "Data Science",
                    rating: 4.9,
                    hours: 14,
                  },
                ]}
              />
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="col-span-12 lg:col-span-4 space-y-6 lg:sticky lg:top-6 h-fit">
            <div className="bg-background rounded-2xl border p-5 shadow-sm">
              <LearningDonut
                completed={completedCount}
                inProgress={inProgressCount}
                notStarted={0}
              />
            </div>

            {monthly && (
              <div className="bg-background rounded-2xl border p-5 shadow-sm">
                <MonthlyStatsCard
                  learningHours={monthly.learning_hours}
                  modulesCompleted={monthly.modules_completed}
                  assessmentsPassed={8}
                />
              </div>
            )}
          </div>
          <div className="col-span-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ContinueLearningSection />

            <RecommendedCourses />
          </div>

          <div className="col-span-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LessonQueue />
          </div>
        </div>
      </div>
    </div>
  );
}
