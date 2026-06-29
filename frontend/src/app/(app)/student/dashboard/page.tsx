"use client";

import { Clock, Zap, Star, Flame } from "lucide-react";

import { useLearningTimer } from "@/hooks/useLearningTimer";
import { useDashboardOverviewData } from "@/hooks/useDashboardOverviewData";

import HeroWelcome from "@/components/blocks/dashboard/HeroWelcome";
import ModernStatCard from "@/components/blocks/dashboard/StatCardBlock";
import { PrimaryDashboardCTA } from "@/components/blocks/dashboard/PrimaryCTA";
import { CommunityTopPicks } from "@/components/blocks/community/CommunityHighlights";

import MonthlyLineChart from "@/components/compositions/student/dashboard/overview/charts/MonthlyLineChart";
import DailyBarChart from "@/components/compositions/student/dashboard/overview/charts/DailyBarChart";
import GoalsSection from "@/components/compositions/student/dashboard/overview/GoalsSection";
import { NotificationSection } from "@/components/compositions/student/dashboard/NotificationPanel";
import RecentAssessments from "@/components/blocks/student/RecentAssessments";
import UpcomingTasks from "@/components/blocks/student/UpComingTasks";
import { Box } from "@/components/shared/primitives";
import { buildPrimaryCta } from "./buildPrimaryCta";

export default function DashboardPage() {
  useLearningTimer(true);

  const { dashboard, enrollments, courseContinue, user, isLoading } =
    useDashboardOverviewData();

  if (isLoading) {
    return (
      <div className="p-6">
        <h2>Loading Dashboard…</h2>
        <p>Fetching your stats and personalized content.</p>
      </div>
    );
  }

  if (!dashboard.base || !user) {
    throw new Error("Dashboard data invariant violated");
  }

  const { base, monthly } = dashboard;
  const { completed, enrollments: allEnrollments } = enrollments;
  const { activeCourses: ongoingCourses } = courseContinue;

  const ctaProps = buildPrimaryCta({
    isLoading,
    ongoingCourses,
    allEnrollments,
  });

  return (
    <div className="w-full mx-auto flex flex-col gap-6">
      {/* Header */}
      <Box className="debug-surface">
        <HeroWelcome
          name={user?.first_name || "Student"}
          message="You've learned 32% more this week. Keep it up!"
        />
      </Box>

      {/* Primary CTA */}
      <Box className="debug-surface">
        <PrimaryDashboardCTA {...ctaProps} />
      </Box>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Box className="stat-surface">
          <ModernStatCard
            title="Total Hours Spent"
            value={base.lifetime_learning_hours.toFixed(1)}
            subtitle="hours spent on learning"
            icon={<Clock />}
          />
        </Box>

        <Box className="stat-surface">
          <ModernStatCard
            title="Current Streak"
            value={base.day_streak}
            subtitle="consecutive days"
            icon={<Flame />}
          />
        </Box>

        <Box className="stat-surface">
          {" "}
          {monthly && (
            <ModernStatCard
              title="This Month"
              value={monthly.learning_hours.toFixed(1)}
              subtitle="learning hours"
              icon={<Zap />}
            />
          )}
        </Box>

        <Box className="stat-surface">
          <ModernStatCard
            title="Courses Done"
            value={completed.length}
            subtitle={`Total Enrollments: ${allEnrollments.length}`}
            icon={<Star />}
          />
        </Box>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-6">
          <MonthlyLineChart />
        </div>
        <div className="col-span-12 lg:col-span-6">
          <DailyBarChart />
        </div>
      </div>

      {/* Bottom sections */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-6 flex flex-col gap-4">
          <GoalsSection />
          <NotificationSection />
          <CommunityTopPicks />
        </div>

        <div className="col-span-12 lg:col-span-6 flex flex-col gap-4">
          <RecentAssessments />
          <UpcomingTasks />
        </div>
      </div>
    </div>
  );
}
