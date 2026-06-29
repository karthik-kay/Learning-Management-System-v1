import {
  LoginCredentials,
  RegisterData,
  RefreshTokenData,
  AuthToken,
} from "@/types/auth";
import {
  Task,
  CreateTaskData,
  UpdateTaskData,
  CreateGoalData,
  UpdateGoalData,
  Goal,
  UpdateEnrollmentData,
  ContinueCourseItem,
  CompletedCourse,
  Quiz,
  QuizAttempt,
  QuizAnswerSubmit,
  CreateQuizData,
  LessonQueueResponse,
  DashboardData,
  Enrollment,
  Course,
  WorkspaceItem,
  Workspace,
  CommunityFeedResponse,
  Ticket,
  CreateTicketData,
  TicketMessage,
  SendMessageData,
  UpdateTicketStatusData,
  CreateOrderPayload,
  CreateOrderResponse,
  VerifyPaymentPayload,
  PaymentHistoryResponse,
} from "@/types";
import {
  ProgramEnrollment as StudentProgramEnrollment,
  PublicCourseDetail,
  PublicCourseListItem,
  PublicCourseProductDetail,
  PublicCourseProductListItem,
  PublicFacultyProfile,
  PublicLearningProgramDetail,
  PublicLearningProgramListItem,
} from "@/types/publicCourse";
import { UserProfile } from "@/types/auth";
import Cookies from "js-cookie";
import { PaginatedResponse } from "@/types/institution/common";
import {
  InstitutionFaculty,
  InstitutionFacultyDetail,
  InstitutionStudent,
  InstitutionStudentDetail,
} from "@/types/institution/people";
import {
  AcademicBatch,
  Degree,
  Department,
  Program,
  Section,
  Subject,
} from "@/types/institution/academic";
import {
  Assignment,
  ComputeSubjectResultPayload,
  EvaluationComponent,
  Exam,
  ExamResult,
  ExamSubject,
  StudentComponentScore,
  StudentCGPA,
  SubjectResult,
  Submission,
} from "@/types/institution/grades";
import {
  AtRiskStudent,
  AttendanceReport,
  BatchPerformanceReport,
  FacultyActivityReport,
  PerformanceReport,
  StudentProgressReport,
  SubjectAttendanceReport,
} from "@/types/institution/reports";
import {
  HODDashboardData,
  InstitutionDashboardData,
} from "@/types/institution/dashboard";
import {
  FacultySubjectAssignment,
  TimeSlot,
  TimetableConflict,
  TimetableEntry,
} from "@/types/institution/timetable";
import {
  AttendanceRecord,
  AttendanceSession,
  AttendanceShortage,
  LeaveApplication,
  LeaveDecisionPayload,
} from "@/types/institution/attendance";
import {
  InstitutionAuditLog,
  InstitutionExportCreatePayload,
  InstitutionExportJob,
} from "@/types/institution/operations";

const DJANGO_API = process.env.NEXT_PUBLIC_DJANGO_API;

type QueryValue = string | number | boolean | null | undefined;
export type QueryParams = Record<string, QueryValue | QueryValue[]>;

class ApiError extends Error {
  status: number;
  endpoint: string;

  constructor(message: string, status: number, endpoint: string) {
    super(message);
    this.status = status;
    this.endpoint = endpoint;
  }
}

function logout() {
  Cookies.remove("access_token", { path: "/" });
  Cookies.remove("refresh_token", { path: "/" });
}

function isAccessTokenExpired(token: string) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

async function refreshAccessToken() {
  const refresh = Cookies.get("refresh_token");
  if (!refresh) return false;

  try {
    const res = await fetch(`${DJANGO_API}/auth/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });

    if (!res.ok) return false;

    const data = await res.json();

    // Reset access token
    Cookies.set("access_token", data.access, {
      expires: 1, // Usually short (1 day or less)
      path: "/",
      secure: true,
      sameSite: "strict",
    });

    // If your backend rotates the refresh token, update it here too
    if (data.refresh) {
      Cookies.set("refresh_token", data.refresh, {
        expires: 7,
        path: "/",
        secure: true,
        sameSite: "strict",
      });
    }

    return true;
  } catch {
    return false;
  }
}

function getAuthHeaders(): HeadersInit {
  const token = Cookies.get("access_token");
  if (token) {
    return {
      Authorization: `Bearer ${token}`,
    };
  }
  return {};
}

function withQuery(endpoint: string, params?: QueryParams) {
  if (!params) return endpoint;

  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item !== null && item !== undefined && item !== "") {
          searchParams.append(key, String(item));
        }
      });
      return;
    }

    if (value !== null && value !== undefined && value !== "") {
      searchParams.set(key, String(value));
    }
  });

  const query = searchParams.toString();

  return query ? `${endpoint}?${query}` : endpoint;
}

async function request<T = unknown>(
  endpoint: string,
  options: RequestInit = {},
  retry = false,
): Promise<T> {
  const authFreeEndpoints = [
    "/auth/login/",
    "/auth/register/",
    "/auth/token/refresh/",
  ];
  const isAuthFree = authFreeEndpoints.some((path) => endpoint.includes(path));

  // Pre-fetch check: If expired, try to refresh before even hitting the API
  if (!isAuthFree) {
    const token = Cookies.get("access_token");
    if (token && isAccessTokenExpired(token)) {
      const refreshed = await refreshAccessToken();
      if (!refreshed) {
        logout();
        throw new ApiError("AUTH_SESSION_EXPIRED", 401, endpoint);
      }
    }
  }

  const res = await fetch(`${DJANGO_API}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(isAuthFree ? {} : getAuthHeaders()),
    },
  });

  if (res.status === 401 && !retry && !isAuthFree) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      return request<T>(endpoint, options, true);
    } else {
      throw new ApiError("AUTH_SESSION_EXPIRED", 401, endpoint);
    }
  }

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    console.error("API ERROR", {
      endpoint,
      status: res.status,
      errorData,
    });
    throw new ApiError(
      errorData?.detail || errorData?.message || "API request failed",
      res.status,
      endpoint,
    );
  }

  if (res.status === 204) return {} as T;
  return res.json() as Promise<T>;
}

function normalizePublicCourseProduct<
  T extends PublicCourseProductListItem | PublicCourseProductDetail,
>(course: T): T {
  const firstInstructor = course.instructors?.[0];
  const displayPriceInr =
    typeof course.display_price_paise === "number"
      ? course.display_price_paise / 100
      : undefined;
  const activePrice =
    course.active_price ??
    (typeof course.display_price_paise === "number"
      ? {
          base_paise: course.display_price_paise,
          final_paise: course.display_price_paise,
          base_inr: course.display_price_paise / 100,
          final_inr: course.display_price_paise / 100,
        }
      : null);

  return {
    ...course,
    active_price: activePrice,
    description: course.description ?? course.short_description,
    faculty_name:
      course.faculty_name ||
      firstInstructor?.display_name ||
      course.instructor_name ||
      "",
    instructor_image: course.instructor_image ?? firstInstructor?.avatar ?? null,
    original_price: course.original_price ?? displayPriceInr ?? null,
    price:
      course.price ??
      activePrice?.final_inr ??
      activePrice?.base_inr ??
      displayPriceInr ??
      0,
    course_type: course.course_type ?? "self_paced",
  };
}

type CommunityGroupSummary = {
  id: number;
  name: string;
};

export const djangoService = {
  getUsers: () => request<UserProfile[]>("/users/"),

  getUser: () => request<UserProfile>("/auth/me/"),

  getReviews: () => request("/reviews/"),

  getCertifications: () => request("/certificates/"),

  getCertificate: (credentialId: string) =>
    request(`/certificates/${credentialId}/`),

  getEnrollments: (): Promise<Enrollment[]> =>
    request<Enrollment[]>("/courses/enrollments/"),

  getCourses: () => request<Course[]>("/courses/courses/"),

  getCourse: (id: number) => request<Course>(`/courses/courses/${id}/`),

  getDashboard: (params?: Record<string, string>) => {
    const query = params ? "?" + new URLSearchParams(params).toString() : "";

    return request<DashboardData>(`/students/dashboard/${query}`);
  },

  createReview: (data: { student: number; course: number; content: string }) =>
    request("/reviews/", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  login: async (credentials: LoginCredentials): Promise<AuthToken> => {
    const data = await request<AuthToken>("/auth/login/", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    const payload = JSON.parse(atob(data.access.split(".")[1]));
    const role = payload.role;

    const cookieOptions = {
      path: "/",
      secure: true,
      sameSite: "strict" as const,
    };
    Cookies.set("access_token", data.access, {
      expires: 1,
      path: "/",
      secure: true,
      sameSite: "strict",
    });

    Cookies.set("refresh_token", data.refresh, {
      expires: 7,
      path: "/",
      secure: true,
      sameSite: "strict",
    });

    Cookies.set("user_role", role, { ...cookieOptions, expires: 7 });

    return data;
  },
  register: (data: RegisterData) =>
    request("/auth/register/", {
      method: "POST",
      body: JSON.stringify({ ...data, role: "student" }),
    }),

  refreshToken: (data: RefreshTokenData) =>
    request("/auth/token/refresh/", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getStudentProfile: (userId: number) =>
    request(`/students/${userId}/profile/`),

  logActivity: (seconds: number) =>
    request("/students/activity/log/", {
      method: "POST",
      body: JSON.stringify({ seconds }),
    }),

  getDailyLearningHours: () =>
    request<{ day: string; hours: number }[]>("/students/activity/daily/"),

  getTasks: (): Promise<Task[]> => request("/students/tasks/"),

  createTask: (data: CreateTaskData) =>
    request("/students/tasks/", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateTask: (id: number, data: UpdateTaskData) =>
    request(`/students/tasks/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  completeTask: (id: number) =>
    request(`/students/tasks/${id}/complete/`, {
      method: "POST",
    }),

  getGoals: (): Promise<Goal[]> => request<Goal[]>("/students/goals/"),

  createGoal: (data: CreateGoalData) =>
    request<Goal>("/students/goals/", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateGoal: (id: number, data: UpdateGoalData) =>
    request<Goal>(`/students/goals/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  deleteGoal: (id: number) =>
    request<void>(`/students/goals/${id}/`, {
      method: "DELETE",
    }),

  checkInGoal: (id: number) =>
    request<Goal>(`/students/goals/${id}/checkin/`, { method: "POST" }),

  async getLessonQueue(): Promise<LessonQueueResponse> {
    return await request("/students/lesson-queue/");
  },

  getPublicCourseProducts: async () => {
    const courses = await request<PublicCourseProductListItem[]>(
      "/public/course-products/",
    );
    return courses.map(normalizePublicCourseProduct);
  },

  getPublicCourseProduct: async (slug: string) => {
    const course = await request<PublicCourseProductDetail>(
      `/public/course-products/${slug}/`,
    );
    return normalizePublicCourseProduct(course);
  },

  getPublicCourses: async (): Promise<PublicCourseListItem[]> => {
    const courses = await request<PublicCourseProductListItem[]>(
      "/public/course-products/",
    );
    return courses.map(normalizePublicCourseProduct);
  },

  getPublicCourse: async (
    slugOrCourseId: string | number,
  ): Promise<PublicCourseDetail> => {
    const endpoint =
      typeof slugOrCourseId === "number"
        ? `/courses/public/courses/${slugOrCourseId}/`
        : `/public/course-products/${slugOrCourseId}/`;
    const course = await request<PublicCourseProductDetail>(
      endpoint,
    );
    return normalizePublicCourseProduct(course);
  },

  getPublicPrograms: () =>
    request<PublicLearningProgramListItem[]>("/public/programs/"),

  getPublicProgram: (slug: string) =>
    request<PublicLearningProgramDetail>(`/public/programs/${slug}/`),

  getPublicFaculty: () =>
    request<PublicFacultyProfile[]>("/public/faculty/"),

  getPublicFacultyProfile: (slug: string) =>
    request<PublicFacultyProfile>(`/public/faculty/${slug}/`),

  getStudentProgramEnrollments: () =>
    request<StudentProgramEnrollment[]>("/student/programs/enrollments/"),

  // Enrollemtns/ student courses
  enrollInCourse: (id: number) =>
    request(`/courses/courses/${id}/enroll/`, {
      method: "POST",
    }),

  updateEnrollment: (
    id: number,
    data: UpdateEnrollmentData,
  ): Promise<Enrollment> =>
    request<Enrollment>(`/courses/enrollments/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  completeEnrollment: (id: number) =>
    request(`/courses/enrollments/${id}/complete/`, {
      method: "POST",
    }),

  getCourseProgress: (courseId: number) =>
    request(`/courses/courses/${courseId}/progress/`),

  getContinueCourses: () =>
    request<ContinueCourseItem[]>("/courses/enrollments/continue/"),

  getCompletedCourses: () =>
    request<CompletedCourse[]>("/courses/enrollments/completed/"),

  completeLesson: (courseId: number, lessonId: number) =>
    request(`/courses/courses/${courseId}/complete_lesson/`, {
      method: "POST",
      body: JSON.stringify({ lesson_id: lessonId }),
    }),

  getLesson: (moduleId: number, lessonId: number) =>
    request(`/courses/lessons/${lessonId}/`),

  resumeCourse: (id: number) => request(`/courses/courses/${id}/resume/`),

  // QUiz related apis
  createQuiz: (data: CreateQuizData): Promise<Quiz> =>
    request(`/courses/quizzes/create/`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getQuiz: (quizId: number): Promise<Quiz> =>
    request(`/courses/quizzes/${quizId}/`),

  submitQuiz: (
    quizId: number,
    answers: QuizAnswerSubmit[],
  ): Promise<QuizAttempt> =>
    request(`/courses/quizzes/${quizId}/submit/`, {
      method: "POST",
      body: JSON.stringify({ answers }),
    }),

  getQuizAttempts: (quizId: number): Promise<QuizAttempt[]> =>
    request(`/courses/quizzes/${quizId}/attempts/`),

  getQuizHistory: (): Promise<QuizAttempt[]> =>
    request(`/courses/quizzes/history/`),

  // IDE workspaces
  getWorkspaces: () => request<Workspace[]>("/ide/workspaces/"),

  createWorkspace: (name: string) =>
    request<Workspace>("/ide/workspaces/", {
      method: "POST",
      body: JSON.stringify({ name }),
    }),

  updateWorkspace: (id: number, name: string) =>
    request<Workspace>(`/ide/workspaces/${id}/`, {
      method: "PATCH",
      body: JSON.stringify({ name }),
    }),

  deleteWorkspace: (id: number) =>
    request<void>(`/ide/workspaces/${id}/`, {
      method: "DELETE",
    }),

  // IDE File Tree
  getWorkspaceTree: (workspaceId: number) =>
    request<WorkspaceItem[]>(`/ide/workspaces/${workspaceId}/tree/`),

  // IDE files and folders
  createItem: (data: {
    workspace: number;
    name: string;
    type: "file" | "folder";
    parent: number | null;
    content?: string;
  }) =>
    request<WorkspaceItem>("/ide/items/", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateItem: (
    id: number,
    data: Partial<{
      name: string;
      content: string;
      parent: number | null;
    }>,
  ) =>
    request<WorkspaceItem>(`/ide/items/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  deleteItem: (id: number) =>
    request<void>(`/ide/items/${id}/delete/`, {
      method: "DELETE",
    }),

  //comunity-groups, api endpint for groups in the comunity

  getGroups: () => request<CommunityGroupSummary[]>("/community/groups/"),

  createGroup: (data: { name: string; description?: string }) =>
    request("/community/groups/create/", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  deleteGroup: (groupId: number) =>
    request(`/community/groups/${groupId}/delete/`, {
      method: "DELETE",
    }),

  exitGroup: (groupId: number) =>
    request(`/community/groups/${groupId}/exit/`, {
      method: "POST",
    }),

  // Updated JS service for better compatibility
  addMemberToGroup: (groupId: number, userId: string | number) =>
    request(`/community/groups/${groupId}/add/`, {
      method: "POST",
      body: JSON.stringify({ user_id: userId }), // Match the key in Django
    }),

  removeMemberFromGroup: (groupId: number, userId: number) =>
    request(`/community/groups/${groupId}/remove/`, {
      method: "POST",
      body: JSON.stringify({ user_id: userId }),
    }),

  getGroupMembers: (groupId: number) =>
    request<unknown[]>(`/community/groups/${groupId}/members/`),
  // community - feed, feed in the community global feed api

  getCommunityFeed: (
    page = 1,
    groupId?: number | null,
  ): Promise<CommunityFeedResponse> => {
    let url = `/community/feed/?page=${page}`;

    if (groupId) {
      url += `&group_id=${groupId}`;
    }

    return request<CommunityFeedResponse>(url);
  },

  createCommunityPost: (data: {
    content: string;
    group?: number | null;
    image?: File;
  }) => {
    const formData = new FormData();
    formData.append("content", data.content);

    if (data.group) {
      formData.append("group", String(data.group));
    }

    if (data.image) {
      formData.append("image", data.image);
    }

    return fetch(`${DJANGO_API}/community/posts/create/`, {
      method: "POST",
      headers: {
        ...getAuthHeaders(),
      },
      body: formData,
    }).then((res) => res.json());
  },

  togglePostLike: (postId: number) =>
    request(`/community/posts/${postId}/like/`, {
      method: "POST",
    }),
  // ========== COMMUNITY - CONTACTS ==========

  getContacts: () => request<unknown[]>("/community/contacts/"),
  //chat room, for community, api endpoints from django community app

  authorizeChatRoom: (roomId: string) =>
    request<{ allowed: boolean }>(
      `/community/chat/authorize/?room_id=${roomId}`,
    ),

  getChatHistory: (roomId: string) =>
    request<unknown[]>(`/community/chat/history/?room_id=${roomId}`),

  // 2. SAVE CHAT MESSAGE (Node server or Frontend can call this)
  saveChatMessage: (roomId: string, message: string) =>
    request<{ status: string }>("/community/chat/save/", {
      method: "POST",
      body: JSON.stringify({ room_id: roomId, message: message }),
    }),

  //ticket endpoints, for ticketing purposes

  getTickets: () => request<Ticket[]>("/tickets/"),

  getTicket: (ticketId: string) => request<Ticket>(`/tickets/${ticketId}/`),

  createTicket: (data: CreateTicketData) => {
    if (data.attachment) {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("type", data.type);
      formData.append("attachment", data.attachment);
      return fetch(`${DJANGO_API}/tickets/`, {
        method: "POST",
        headers: { ...getAuthHeaders() }, // no Content-Type, let browser set it
        body: formData,
      }).then((res) => res.json()) as Promise<Ticket>;
    }
    return request<Ticket>("/tickets/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateTicketStatus: (ticketId: string, data: UpdateTicketStatusData) =>
    request<Ticket>(`/tickets/${ticketId}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  getTicketMessages: (ticketId: string) =>
    request<TicketMessage[]>(`/tickets/messages/?ticket=${ticketId}`),

  sendMessage: (data: SendMessageData) => {
    if (data.attachment) {
      const formData = new FormData();
      formData.append("ticket", data.ticket);
      formData.append("message", data.message);
      formData.append("attachment", data.attachment);
      if (data.parent) formData.append("parent", data.parent);
      return fetch(`${DJANGO_API}/tickets/messages/`, {
        method: "POST",
        headers: { ...getAuthHeaders() },
        body: formData,
      }).then((res) => res.json()) as Promise<TicketMessage>;
    }
    return request<TicketMessage>("/tickets/messages/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  //payment api endpoints, like to process payments.

  createOrder: (data: CreateOrderPayload) =>
    request<CreateOrderResponse>("/payments/create-order/", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  verifyPayment: (data: VerifyPaymentPayload) =>
    request("/payments/verify/", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getPaymentHistory: () =>
    request<PaymentHistoryResponse>("/payments/history/"),

  // ================= INSTITUTION DASHBOARD =================

  getAdminDashboard: () =>
    request<InstitutionDashboardData>("/institution/dashboards/admin/"),

  getHodDashboard: () => request<HODDashboardData>("/institution/dashboards/hod/"),

  // ================= INSTITUTION PEOPLE =================

  // Students
  getInstitutionStudents: (params?: QueryParams) =>
    request<PaginatedResponse<InstitutionStudent>>(
      withQuery("/institution/students/", params),
    ),

  getInstitutionStudent: (id: number) =>
    request<InstitutionStudentDetail>(`/institution/students/${id}/`),

  createInstitutionStudent: (data: unknown) =>
    request<InstitutionStudentDetail>("/institution/students/", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateInstitutionStudent: (id: number, data: unknown) =>
    request<InstitutionStudentDetail>(`/institution/students/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  suspendStudent: (id: number, data?: unknown) =>
    request(`/institution/students/${id}/suspension/`, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    }),

  promoteStudent: (id: number, data?: unknown) =>
    request(`/institution/students/${id}/promotion/`, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    }),

  bulkImportStudents: (file: File) => {
    const formData = new FormData();

    formData.append("file", file);

    return fetch(`${DJANGO_API}/institution/students/imports/`, {
      method: "POST",
      headers: {
        ...getAuthHeaders(),
      },
      body: formData,
    }).then((res) => res.json()) as Promise<{
      created: number[];
    }>;
  },

  // Faculty
  getInstitutionFaculty: (params?: QueryParams) =>
    request<PaginatedResponse<InstitutionFaculty>>(
      withQuery("/institution/faculty/", params),
    ),

  getInstitutionFacultyDetail: (id: number) =>
    request<InstitutionFacultyDetail>(`/institution/faculty/${id}/`),

  createInstitutionFaculty: (data: unknown) =>
    request<InstitutionFacultyDetail>("/institution/faculty/", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateInstitutionFaculty: (id: number, data: unknown) =>
    request<InstitutionFacultyDetail>(`/institution/faculty/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  suspendFaculty: (id: number, data?: unknown) =>
    request(`/institution/faculty/${id}/suspension/`, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    }),

  reactivateFaculty: (id: number, data?: unknown) =>
    request(`/institution/faculty/${id}/reactivation/`, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    }),

  offboardFaculty: (id: number, data?: unknown) =>
    request(`/institution/faculty/${id}/offboarding/`, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    }),

  makeHod: (facultyId: number, departmentId: number) =>
    request(`/institution/faculty/${facultyId}/hod-assignment/`, {
      method: "POST",

      body: JSON.stringify({
        department_id: departmentId,
      }),
    }),

  // ================= INSTITUTION ACADEMIC =================

  getDegrees: (params?: QueryParams) =>
    request<PaginatedResponse<Degree>>(withQuery("/institution/degrees/", params)),

  getDegree: (id: number) => request<Degree>(`/institution/degrees/${id}/`),

  createDegree: (data: unknown) =>
    request<Degree>("/institution/degrees/", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateDegree: (id: number, data: unknown) =>
    request<Degree>(`/institution/degrees/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  getDepartments: (params?: QueryParams) =>
    request<PaginatedResponse<Department>>(
      withQuery("/institution/departments/", params),
    ),

  getPrograms: (params?: QueryParams) =>
    request<PaginatedResponse<Program>>(withQuery("/institution/programs/", params)),

  getBatches: (params?: QueryParams) =>
    request<PaginatedResponse<AcademicBatch>>(
      withQuery("/institution/batches/", params),
    ),

  getSections: (params?: QueryParams) =>
    request<PaginatedResponse<Section>>(withQuery("/institution/sections/", params)),

  getSubjects: (params?: QueryParams) =>
    request<PaginatedResponse<Subject>>(withQuery("/institution/subjects/", params)),

  //individual apis

  getDepartment: (id: number) =>
    request<Department>(`/institution/departments/${id}/`),

  getProgram: (id: number) => request<Program>(`/institution/programs/${id}/`),

  getBatch: (id: number) => request<AcademicBatch>(`/institution/batches/${id}/`),

  getSection: (id: number) => request<Section>(`/institution/sections/${id}/`),

  getSubject: (id: number) => request<Subject>(`/institution/subjects/${id}/`),

  createDepartment: (data: unknown) =>
    request<Department>("/institution/departments/", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateDepartment: (id: number, data: unknown) =>
    request<Department>(`/institution/departments/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  createProgram: (data: unknown) =>
    request<Program>("/institution/programs/", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateProgram: (id: number, data: unknown) =>
    request<Program>(`/institution/programs/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  createBatch: (data: unknown) =>
    request<AcademicBatch>("/institution/batches/", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateBatch: (id: number, data: unknown) =>
    request<AcademicBatch>(`/institution/batches/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  createSection: (data: unknown) =>
    request<Section>("/institution/sections/", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateSection: (id: number, data: unknown) =>
    request<Section>(`/institution/sections/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  createSubject: (data: unknown) =>
    request<Subject>("/institution/subjects/", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateSubject: (id: number, data: unknown) =>
    request<Subject>(`/institution/subjects/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  // ================= INSTITUTION GRADES =================

  getExams: (params?: QueryParams) =>
    request<PaginatedResponse<Exam>>(withQuery("/institution/exams/", params)),

  getExam: (id: number) => request<Exam>(`/institution/exams/${id}/`),

  createExam: (data: unknown) =>
    request<Exam>("/institution/exams/", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateExam: (id: number, data: unknown) =>
    request<Exam>(`/institution/exams/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  publishExam: (id: number, data?: unknown) =>
    request(`/institution/exams/${id}/publication/`, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    }),

  getResults: (params?: QueryParams) =>
    request<PaginatedResponse<ExamResult>>(
      withQuery("/institution/exam-results/", params),
    ),

  publishResults: (examId: number, data?: unknown) =>
    request(`/institution/exams/${examId}/result-publication/`, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    }),

  getStudentCGPA: (studentId: number) =>
    request<StudentCGPA>(`/institution/students/${studentId}/cgpa/`),

  getEvaluationComponents: (params?: QueryParams) =>
    request<PaginatedResponse<EvaluationComponent>>(
      withQuery("/institution/evaluation-components/", params),
    ),

  getEvaluationComponent: (id: number) =>
    request<EvaluationComponent>(`/institution/evaluation-components/${id}/`),

  createEvaluationComponent: (data: unknown) =>
    request<EvaluationComponent>("/institution/evaluation-components/", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateEvaluationComponent: (id: number, data: unknown) =>
    request<EvaluationComponent>(`/institution/evaluation-components/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  getStudentScores: (params?: QueryParams) =>
    request<PaginatedResponse<StudentComponentScore>>(
      withQuery("/institution/component-scores/", params),
    ),

  uploadBulkScores: (data: unknown) =>
    request("/institution/component-scores/bulk/", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getExamSubjects: (examId: number, params?: QueryParams) =>
    request<PaginatedResponse<ExamSubject>>(
      withQuery(`/institution/exams/${examId}/subjects/`, params),
    ),

  getSubjectResults: (params?: QueryParams) =>
    request<PaginatedResponse<SubjectResult>>(
      withQuery("/institution/subject-results/", params),
    ),

  computeSubjectResult: (data: ComputeSubjectResultPayload) =>
    request<SubjectResult>("/institution/subject-results/compute/", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // ================= INSTITUTION TIMETABLE =================

  getTimetableEntries: (params?: QueryParams) =>
    request<PaginatedResponse<TimetableEntry>>(
      withQuery("/institution/timetable-entries/", params),
    ),

  getTimeSlots: (params?: QueryParams) =>
    request<PaginatedResponse<TimeSlot>>(
      withQuery("/institution/time-slots/", params),
    ),

  getFacultyAssignments: (params?: QueryParams) =>
    request<PaginatedResponse<FacultySubjectAssignment>>(
      withQuery("/institution/teaching-assignments/", params),
    ),

  publishTimetable: (sectionId: number, data?: unknown) =>
    request(`/institution/sections/${sectionId}/timetable-publication/`, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    }),

  getConflicts: (params?: QueryParams) =>
    request<TimetableConflict[]>(
      withQuery("/institution/timetable-conflicts/", params),
    ),

  addSubstitute: (data: unknown) =>
    request("/institution/substitutions/", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getTimeSlot: (id: number) => request<TimeSlot>(`/institution/time-slots/${id}/`),

  createTimeSlot: (data: unknown) =>
    request<TimeSlot>("/institution/time-slots/", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateTimeSlot: (id: number, data: unknown) =>
    request<TimeSlot>(`/institution/time-slots/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  getFacultyAssignment: (id: number) =>
    request<FacultySubjectAssignment>(`/institution/teaching-assignments/${id}/`),

  createFacultyAssignment: (data: unknown) =>
    request<FacultySubjectAssignment>("/institution/teaching-assignments/", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateFacultyAssignment: (id: number, data: unknown) =>
    request<FacultySubjectAssignment>(`/institution/teaching-assignments/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  getTimetableEntry: (id: number) =>
    request<TimetableEntry>(`/institution/timetable-entries/${id}/`),

  createTimetableEntry: (data: unknown) =>
    request<TimetableEntry>("/institution/timetable-entries/", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateTimetableEntry: (id: number, data: unknown) =>
    request<TimetableEntry>(`/institution/timetable-entries/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  // ================= INSTITUTION ATTENDANCE =================

  getAttendanceSessions: (params?: QueryParams) =>
    request<PaginatedResponse<AttendanceSession>>(
      withQuery("/institution/attendance-sessions/", params),
    ),

  getAttendanceRecords: (params?: QueryParams) =>
    request<PaginatedResponse<AttendanceRecord>>(
      withQuery("/institution/attendance-records/", params),
    ),

  markBulkAttendance: (data: unknown) =>
    request("/institution/attendance-records/bulk/", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getAttendanceShortage: (params?: QueryParams) =>
    request<AttendanceShortage[]>(
      withQuery("/institution/attendance-shortages/", params),
    ),

  unlockAttendance: (sessionId: number, data?: unknown) =>
    request(`/institution/attendance-sessions/${sessionId}/unlock/`, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    }),

  getAttendanceSession: (id: number) =>
    request<AttendanceSession>(`/institution/attendance-sessions/${id}/`),

  createAttendanceSession: (data: unknown) =>
    request<AttendanceSession>("/institution/attendance-sessions/", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateAttendanceSession: (id: number, data: unknown) =>
    request<AttendanceSession>(`/institution/attendance-sessions/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  applyLeave: (data: unknown) =>
    request<LeaveApplication>("/institution/leave-applications/", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getLeaveApplications: (params?: QueryParams) =>
    request<PaginatedResponse<LeaveApplication>>(
      withQuery("/institution/leave-applications/", params),
    ),

  approveLeave: (leaveId: number, data: LeaveDecisionPayload = { decision: "approved" }) =>
    request<LeaveApplication>(`/institution/leave-applications/${leaveId}/approval/`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  rejectLeave: (leaveId: number, review_note?: string) =>
    request<LeaveApplication>(`/institution/leave-applications/${leaveId}/approval/`, {
      method: "POST",
      body: JSON.stringify({ decision: "rejected", review_note }),
    }),

  sendBulkShortageAlert: (data?: unknown) =>
    request("/institution/attendance-shortage-alerts/bulk/", {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    }),

  // ================= INSTITUTION REPORTS =================

  getAttendanceReport: (params?: QueryParams) =>
    request<PaginatedResponse<AttendanceReport>>(
      withQuery("/institution/reports/attendance/", params),
    ),

  getPerformanceReport: (params?: QueryParams) =>
    request<PaginatedResponse<PerformanceReport>>(
      withQuery("/institution/reports/performance/", params),
    ),

  getFacultyActivityReport: (params?: QueryParams) =>
    request<PaginatedResponse<FacultyActivityReport>>(
      withQuery("/institution/reports/faculty-activity/", params),
    ),

  getBatchPerformanceReport: (params?: QueryParams) =>
    request<PaginatedResponse<BatchPerformanceReport>>(
      withQuery("/institution/reports/batch-performance/", params),
    ),

  getStudentProgressReport: (studentId: number, params?: QueryParams) =>
    request<StudentProgressReport>(
      withQuery(`/institution/students/${studentId}/progress-report/`, params),
    ),

  getAssignments: (params?: QueryParams) =>
    request<PaginatedResponse<Assignment>>(
      withQuery("/institution/assignments/", params),
    ),

  getAssignment: (id: number) =>
    request<Assignment>(`/institution/assignments/${id}/`),

  createAssignment: (data: unknown) =>
    request<Assignment>("/institution/assignments/", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateAssignment: (id: number, data: unknown) =>
    request<Assignment>(`/institution/assignments/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  getSubmissions: (params?: QueryParams) =>
    request<PaginatedResponse<Submission>>(
      withQuery("/institution/submissions/", params),
    ),

  // Change method
  markSubmission: (submissionId: number, data: unknown) =>
    request(`/institution/submissions/${submissionId}/marks/`, {
      method: "PATCH", // ← was POST, should be PATCH
      body: JSON.stringify(data),
    }),

  getSubjectAttendanceReport: (studentId: number, params?: QueryParams) =>
    request<SubjectAttendanceReport[]>(
      withQuery(`/institution/students/${studentId}/attendance-report/`, params),
    ),

  getAtRiskStudents: (params?: QueryParams) =>
    request<PaginatedResponse<AtRiskStudent>>(
      withQuery("/institution/reports/at-risk-students/", params),
    ),

  getInstitutionAuditLogs: (params?: QueryParams) =>
    request<PaginatedResponse<InstitutionAuditLog>>(
      withQuery("/institution/audit-logs/", params),
    ),

  getInstitutionExports: (params?: QueryParams) =>
    request<PaginatedResponse<InstitutionExportJob>>(
      withQuery("/institution/exports/", params),
    ),

  getInstitutionExport: (id: number) =>
    request<InstitutionExportJob>(`/institution/exports/${id}/`),

  createInstitutionExport: (data: InstitutionExportCreatePayload) =>
    request<InstitutionExportJob>("/institution/exports/", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
