"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NotificationCard, NotificationRow } from "./NotificationItem";

export function NotificationPanelCard() {
  return (
    <div className="rounded-xl  border  p-4 bg-surface-bg flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Latest Notification</h2>
        <Button className="text-sm bg-surface-light text-text-muted hover:bg-surface-light/80">
          Mark all read
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-4 w-full mb-4 bg-surface-light">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="reminders">Reminders</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
        </TabsList>

        {/* All */}
        <TabsContent value="all" className="flex flex-col gap-3">
          <NotificationCard
            title="Course Completed!"
            message="You completed JavaScript fundamentals"
            time="2 hours ago"
          />
          <NotificationCard
            title="Course Completed!"
            message="You completed React Basics"
            time="4 hours ago"
          />
          <NotificationCard
            title="New Course Available!"
            message="Advanced React course is now live"
            time="1 day ago"
          />
        </TabsContent>

        {/* Achievements */}
        <TabsContent value="achievements" className="flex flex-col gap-3">
          <NotificationCard
            title="Achievement Unlocked!"
            message="Learning streak hit 7 days"
            time="1 day ago"
          />
        </TabsContent>

        {/* Reminders */}
        <TabsContent value="reminders" className="flex flex-col gap-3">
          <NotificationCard
            title="Daily Reminder"
            message="Don't forget to complete today's lesson"
            time="1 hour ago"
          />
        </TabsContent>

        {/* Courses */}
        <TabsContent value="courses" className="flex flex-col gap-3">
          <NotificationCard
            title="New Course Release"
            message="Full-Stack Roadmap updated"
            time="3 days ago"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export function NotificationSection() {
  return (
    <section className="w-full h-full max-w-5xl border px-4 rounded-md bg-white mx-auto py-4">
      {/* SECTION HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold tracking-tight">Notifications</h2>

        <Button
          className="text-xs bg-gray-100 text-gray-600 hover:bg-gray-200"
          variant="ghost"
        >
          Mark all as read
        </Button>
      </div>

      {/* TABS */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="flex w-full gap-2 bg-transparent p-0 mb-4">
          <TabsTrigger className="flex-1" value="all">
            All
          </TabsTrigger>
          <TabsTrigger className="flex-1" value="achievements">
            Achievements
          </TabsTrigger>
          <TabsTrigger className="flex-1" value="reminders">
            Reminders
          </TabsTrigger>
          <TabsTrigger className="flex-1" value="courses">
            Courses
          </TabsTrigger>
        </TabsList>

        {/* CONTENT AREA */}
        <div className="bg-white rounded-xl shadow-sm border ">
          {/* All */}
          <TabsContent value="all" className="space-y-1">
            <NotificationRow
              title="Course Completed!"
              message="You completed JavaScript fundamentals"
              time="2 hours ago"
            />
            <NotificationRow
              title="Course Completed!"
              message="You completed React Basics"
              time="4 hours ago"
            />
            <NotificationRow
              title="New Course Available!"
              message="Advanced React course is now live"
              time="1 day ago"
            />
          </TabsContent>

          {/* Achievements */}
          <TabsContent value="achievements" className="space-y-1">
            <NotificationRow
              title="Achievement Unlocked!"
              message="Learning streak hit 7 days"
              time="1 day ago"
            />
          </TabsContent>

          {/* Reminders */}
          <TabsContent value="reminders" className="space-y-1">
            <NotificationRow
              title="Daily Reminder"
              message="Don't forget to complete today's lesson"
              time="1 hour ago"
            />
          </TabsContent>

          {/* Courses */}
          <TabsContent value="courses" className="space-y-1">
            <NotificationRow
              title="New Course Release"
              message="Full-Stack Roadmap updated"
              time="3 days ago"
            />
          </TabsContent>
        </div>
      </Tabs>
    </section>
  );
}
