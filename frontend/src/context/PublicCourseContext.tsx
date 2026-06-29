"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { PublicCourseDetail } from "@/types";

interface PublicCourseContextValue {
  course: PublicCourseDetail | null;
  setCourse: (c: PublicCourseDetail) => void;
}

interface PublicCourseProviderProps {
  children: ReactNode;
  initialCourse: PublicCourseDetail | null;
}

const PublicCourseContext = createContext<PublicCourseContextValue | null>(
  null
);

export function PublicCourseProvider({
  children,
  initialCourse,
}: PublicCourseProviderProps) {
  const [course, setCourse] = useState(initialCourse);

  return (
    <PublicCourseContext.Provider value={{ course, setCourse }}>
      {children}
    </PublicCourseContext.Provider>
  );
}

export function usePublicCourse() {
  const ctx = useContext(PublicCourseContext);
  if (!ctx)
    throw new Error("usePublicCourse must be used inside PublicCourseProvider");
  return ctx;
}
