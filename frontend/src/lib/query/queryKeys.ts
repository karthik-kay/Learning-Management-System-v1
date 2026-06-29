export const queryKeys = {
  public: {
    programs: () => ["public", "programs"] as const,
    program: (slug: string) => ["public", "programs", slug] as const,
    courseProducts: () => ["public", "course-products"] as const,
    courseProduct: (slugOrCourseId: string | number) =>
      ["public", "course-products", String(slugOrCourseId)] as const,
    faculty: () => ["public", "faculty"] as const,
    facultyProfile: (slug: string) => ["public", "faculty", slug] as const,
    page: (pageKey: string) => ["public", "content", "pages", pageKey] as const,
    faqs: (params?: unknown) =>
      ["public", "content", "faqs", params ?? {}] as const,
    blogCategories: () => ["public", "content", "blog-categories"] as const,
    blogPosts: (params?: unknown) =>
      ["public", "content", "blog", params ?? {}] as const,
    blogPost: (slug: string) => ["public", "content", "blog", slug] as const,
    domains: () => ["public", "content", "domains"] as const,
    careerPaths: (params?: unknown) =>
      ["public", "content", "career-paths", params ?? {}] as const,
    careerPath: (slug: string) =>
      ["public", "content", "career-paths", slug] as const,
    roadmaps: (params?: unknown) =>
      ["public", "content", "roadmaps", params ?? {}] as const,
    roadmap: (slug: string) => ["public", "content", "roadmaps", slug] as const,
    events: (params?: unknown) =>
      ["public", "content", "events", params ?? {}] as const,
    event: (slug: string) => ["public", "content", "events", slug] as const,
  },
  student: {
    dashboard: (params?: Record<string, string>) =>
      ["student", "dashboard", params ?? {}] as const,
    enrollments: () => ["student", "enrollments"] as const,
    completedCourses: () => ["student", "courses", "completed"] as const,
    continueCourses: () => ["student", "courses", "continue"] as const,
    programEnrollments: () => ["student", "program-enrollments"] as const,
    tickets: () => ["student", "tickets"] as const,
    ticket: (ticketId: string) => ["student", "tickets", ticketId] as const,
    ticketMessages: (ticketId: string) =>
      ["student", "tickets", ticketId, "messages"] as const,
  },
  payments: {
    history: () => ["payments", "history"] as const,
  },
  institution: {
    dashboard: (role: "admin" | "hod") =>
      ["institution", "dashboard", role] as const,
    students: (params?: unknown) =>
      ["institution", "students", params ?? {}] as const,
    student: (id: number) => ["institution", "students", id] as const,
    faculty: (params?: unknown) =>
      ["institution", "faculty", params ?? {}] as const,
    facultyDetail: (id: number) => ["institution", "faculty", id] as const,
    degrees: () => ["institution", "degrees"] as const,
    departments: () => ["institution", "departments"] as const,
    department: (id: number) => ["institution", "departments", id] as const,
    programs: () => ["institution", "programs"] as const,
    program: (id: number) => ["institution", "programs", id] as const,
    batches: () => ["institution", "batches"] as const,
    batch: (id: number) => ["institution", "batches", id] as const,
    sections: () => ["institution", "sections"] as const,
    section: (id: number) => ["institution", "sections", id] as const,
    subjects: () => ["institution", "subjects"] as const,
    subject: (id: number) => ["institution", "subjects", id] as const,
    timeSlots: () => ["institution", "time-slots"] as const,
    teachingAssignments: () =>
      ["institution", "teaching-assignments"] as const,
    timetableEntries: () => ["institution", "timetable-entries"] as const,
    timetableConflicts: () => ["institution", "timetable-conflicts"] as const,
    attendanceSessions: () =>
      ["institution", "attendance-sessions"] as const,
    attendanceRecords: () => ["institution", "attendance-records"] as const,
    attendanceShortages: () =>
      ["institution", "attendance-shortages"] as const,
    leaveApplications: (params?: unknown) =>
      ["institution", "leave-applications", params ?? {}] as const,
    exams: () => ["institution", "exams"] as const,
    exam: (id: number) => ["institution", "exams", id] as const,
    examSubjects: (examId: number) =>
      ["institution", "exams", examId, "subjects"] as const,
    evaluationComponents: () =>
      ["institution", "evaluation-components"] as const,
    componentScores: () => ["institution", "component-scores"] as const,
    examResults: () => ["institution", "exam-results"] as const,
    subjectResults: () => ["institution", "subject-results"] as const,
    assignments: () => ["institution", "assignments"] as const,
    submissions: () => ["institution", "submissions"] as const,
    reports: (kind: string) => ["institution", "reports", kind] as const,
    studentReport: (studentId: number, kind: string) =>
      ["institution", "students", studentId, "reports", kind] as const,
    auditLogs: (params?: unknown) =>
      ["institution", "audit-logs", params ?? {}] as const,
    exports: (params?: unknown) =>
      ["institution", "exports", params ?? {}] as const,
    exportJob: (id: number) => ["institution", "exports", id] as const,
  },
};
