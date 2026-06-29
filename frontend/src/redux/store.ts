import { configureStore, combineReducers } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";
import assessmentReducer from "./slices/assessmentSlice";
import dashboardReducer from "./slices/dashboardSlice";
import tasksReducer from "./slices/tasksSlice";
import goalsReducer from "./slices/goalsSlice";
import coursesReducer from "./slices/coursesSlice";
import enrollmentsReducer from "./slices/enrollmentsSlice";
import courseContinueReducer from "./slices/courseContinueSlice";
import userReducer from "./slices/userSlice";
import lessonQueueReducer from "./slices/lessonQueueSlice";
import ideReducer from "./slices/ideSlice";
import certificateReducer from "./slices/certificateSlice";
import ticketReducer from "./slices/ticketSlice";
import paymentReducer from "./slices/paymentSlice";
import cartReducer from "./slices/cartSlice";

import institutionDashboardReducer from "./institution/dashboard.slice";

import institutionPeopleReducer from "./institution/people.slice";

import institutionAcademicReducer from "./institution/academic.slice";

import institutionAttendanceReducer from "./institution/attendance.slice";

import institutionGradesReducer from "./institution/grades.slice";

import institutionTimetableReducer from "./institution/timetable.slice";

import institutionReportsReducer from "./institution/report.slice";

const appReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  dashboard: dashboardReducer,
  tasks: tasksReducer,
  goals: goalsReducer,
  courses: coursesReducer,
  ide: ideReducer,
  assessments: assessmentReducer,
  courseContinue: courseContinueReducer,
  enrollments: enrollmentsReducer,
  lessonQueue: lessonQueueReducer,
  certificates: certificateReducer,
  tickets: ticketReducer,
  payment: paymentReducer,
  cart: cartReducer,
  institutionDashboard: institutionDashboardReducer,

  institutionPeople: institutionPeopleReducer,

  institutionAcademic: institutionAcademicReducer,

  institutionAttendance: institutionAttendanceReducer,

  institutionGrades: institutionGradesReducer,

  institutionTimetable: institutionTimetableReducer,

  institutionReports: institutionReportsReducer,
});

const rootReducer = (state: any, action: any) => {
  if (action.type === "auth/logout") {
    state = undefined;
  }
  return appReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
