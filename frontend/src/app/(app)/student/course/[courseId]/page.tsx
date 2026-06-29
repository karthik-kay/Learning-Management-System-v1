"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { djangoService } from "@/services/djangoService";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { CheckCircle2, BookOpen, PlayCircle } from "lucide-react";

interface Lesson {
  id: number;
  title: string;
  order: number;
  completed: boolean;
}

interface Module {
  id: number;
  title: string;
  order: number;
  lessons: Lesson[];
}

interface CourseProgressResponse {
  course: {
    id: number;
    title: string;
    description: string;
  };
  progress_percent: number;
  completed_lessons: number;
  total_lessons: number;
  modules: Module[];
}

export default function EnrolledCoursePage() {
  const { courseId } = useParams();
  const [data, setData] = useState<CourseProgressResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadCourse() {
    try {
      const resp = await djangoService.getCourseProgress(Number(courseId));
      setData(resp);
    } catch (err: unknown) {
      let msg = "Failed to load course.";
      if (err && typeof err === "object" && "message" in err) {
        msg = String((err as any).message);
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  async function markLessonComplete(lessonId: number) {
    try {
      await djangoService.completeLesson(Number(courseId), lessonId);
      loadCourse(); // refresh progress
    } catch (err: unknown) {
      console.error(err);
    }
  }

  useEffect(() => {
    loadCourse();
  }, [courseId]);

  useEffect(() => {
    console.log("params:", courseId);
  }, []);

  if (loading) return <div className="p-10">Loading course...</div>;
  if (error) return <div className="p-10 text-red-600">{error}</div>;
  if (!data) return null;

  const { course, modules } = data;

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* HEADER */}
      <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
      <p className="text-gray-600 mb-6">{course.description}</p>

      {/* PROGRESS */}
      <h3 className="text-xl font-semibold mb-2">Progress</h3>
      <p className="text-gray-600 mb-4">
        {data.completed_lessons}/{data.total_lessons} lessons completed (
        {data.progress_percent.toFixed(1)}%)
      </p>

      {/* CONTENT */}
      <h3 className="text-2xl font-bold mt-10 mb-4">Course Content</h3>

      <Accordion type="multiple">
        {modules.map((module) => (
          <AccordionItem key={module.id} value={`module-${module.id}`}>
            <AccordionTrigger className="text-lg font-semibold">
              {module.title}
            </AccordionTrigger>

            <AccordionContent>
              <div className="p-3 space-y-2">
                {module.lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="flex justify-between items-center border rounded p-3 bg-white"
                  >
                    <div className="flex items-center gap-3">
                      {lesson.completed ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      ) : (
                        <BookOpen className="h-5 w-5 text-gray-600" />
                      )}
                      <span className="font-medium">{lesson.title}</span>
                    </div>

                    <div className="flex gap-3">
                      {/* MARK COMPLETE */}
                      {!lesson.completed && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => markLessonComplete(lesson.id)}
                        >
                          Mark Complete
                        </Button>
                      )}

                      {/* OPEN LESSON (your lesson viewer later) */}
                      <Button size="sm" asChild>
                        <a
                          href={`/student/course/${courseId}/modules/${module.id}/lessons/${lesson.id}`}
                        >
                          <PlayCircle className="h-4 w-4 mr-1" />
                          Open
                        </a>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
