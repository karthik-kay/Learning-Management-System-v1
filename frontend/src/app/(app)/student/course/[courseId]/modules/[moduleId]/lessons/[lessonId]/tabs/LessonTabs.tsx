"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import { OverviewTab } from "./OverviewTab";
import { TranscriptTab } from "./TranscriptTab";
import { NotesTab } from "./NotesTab";
import { ResourcesTab } from "./ResourcesTab";
import { DiscussionTab } from "./DiscussionTab";

interface LessonTabsProps {
  lessonId: string;
}

export function LessonTabs({ lessonId }: LessonTabsProps) {
  return (
    <div className="bg-white flex-1">
      <Tabs defaultValue="overview" className="w-full">
        {/* Sticky tab bar */}
        <div className="sticky top-0 z-10 bg-white border-b">
          <TabsList className="w-full justify-start gap-6 px-6 h-12">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transcript">Transcript</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="discussion">Discussion</TabsTrigger>
          </TabsList>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <TabsContent value="overview">
            <OverviewTab lessonId={lessonId} />
          </TabsContent>

          <TabsContent value="transcript">
            <TranscriptTab lessonId={lessonId} />
          </TabsContent>

          <TabsContent value="notes">
            <NotesTab lessonId={lessonId} />
          </TabsContent>

          <TabsContent value="resources">
            <ResourcesTab lessonId={lessonId} />
          </TabsContent>

          <TabsContent value="discussion">
            <DiscussionTab lessonId={lessonId} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
