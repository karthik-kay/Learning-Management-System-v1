import { createSlice, createAsyncThunk, isRejected } from "@reduxjs/toolkit";

import {
  PerformanceReport,
  FacultyActivityReport,
  BatchPerformanceReport,
  StudentProgressReport,
  SubjectAttendanceReport,
  AttendanceReport,
  AtRiskStudent,
} from "@/types/institution/reports";

import { djangoService } from "@/services/djangoService";
import { PaginatedResponse } from "@/types/institution/common";

type RequestStatus = "idle" | "loading" | "succeeded" | "failed";

interface ReportsState {
  attendanceSummary: {
    list: AttendanceReport[];

    status: RequestStatus;
  };

  studentAttendance: {
    list: SubjectAttendanceReport[];

    status: RequestStatus;
  };

  performance: {
    list: PerformanceReport[];

    status: RequestStatus;
  };

  atRisk: {
    list: AtRiskStudent[];

    status: RequestStatus;
  };

  faculty: {
    list: FacultyActivityReport[];

    status: RequestStatus;
  };

  batches: {
    list: BatchPerformanceReport[];

    status: RequestStatus;
  };

  student: {
    data: StudentProgressReport | null;

    status: RequestStatus;
  };

  error: string | null;
}

const initialState: ReportsState = {
  attendanceSummary: {
    list: [],

    status: "idle",
  },

  studentAttendance: {
    list: [],

    status: "idle",
  },

  performance: {
    list: [],

    status: "idle",
  },

  atRisk: {
    list: [],

    status: "idle",
  },

  faculty: {
    list: [],

    status: "idle",
  },

  batches: {
    list: [],

    status: "idle",
  },

  student: {
    data: null,

    status: "idle",
  },

  error: null,
};

export const fetchAttendanceSummary = createAsyncThunk<AttendanceReport[]>(
  "reports/attendanceSummary",

  async () => {
    return await djangoService.getAttendanceReport();
  },
);

export const fetchStudentAttendance = createAsyncThunk<
  SubjectAttendanceReport[],
  number
>(
  "reports/studentAttendance",

  async (studentId) => {
    return await djangoService.getSubjectAttendanceReport(studentId);
  },
);

export const fetchPerformanceReport = createAsyncThunk<PerformanceReport[]>(
  "reports/performance",

  async () => {
    return await djangoService.getPerformanceReport();
  },
);

export const fetchAtRiskStudents = createAsyncThunk<
  PaginatedResponse<AtRiskStudent>
>(
  "reports/atRisk",

  async () => {
    return await djangoService.getAtRiskStudents();
  },
);

export const fetchFacultyReport = createAsyncThunk<
  PaginatedResponse<FacultyActivityReport>
>(
  "reports/faculty",

  async () => {
    return await djangoService.getFacultyActivityReport();
  },
);

export const fetchBatchReport = createAsyncThunk<BatchPerformanceReport[]>(
  "reports/batch",

  async () => {
    return await djangoService.getBatchPerformanceReport();
  },
);

export const fetchStudentReport = createAsyncThunk<
  StudentProgressReport,
  number
>(
  "reports/student",

  async (studentId) => {
    return await djangoService.getStudentProgressReport(studentId);
  },
);

const reportsSlice = createSlice({
  name: "reports",

  initialState,

  reducers: {
    clearReportsError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(
        fetchAttendanceSummary.pending,

        (state) => {
          state.attendanceSummary.status = "loading";
        },
      )

      .addCase(
        fetchAttendanceSummary.fulfilled,

        (state, action) => {
          state.attendanceSummary.status = "succeeded";

          state.attendanceSummary.list = action.payload;
        },
      )

      .addCase(
        fetchStudentAttendance.pending,

        (state) => {
          state.studentAttendance.status = "loading";
        },
      )

      .addCase(
        fetchStudentAttendance.fulfilled,

        (state, action) => {
          state.studentAttendance.status = "succeeded";

          state.studentAttendance.list = action.payload;
        },
      )

      .addCase(
        fetchPerformanceReport.pending,

        (state) => {
          state.performance.status = "loading";
        },
      )

      .addCase(
        fetchPerformanceReport.fulfilled,

        (state, action) => {
          state.performance.status = "succeeded";

          state.performance.list = action.payload;
        },
      )

      .addCase(
        fetchAtRiskStudents.pending,

        (state) => {
          state.atRisk.status = "loading";
        },
      )

      .addCase(
        fetchAtRiskStudents.fulfilled,

        (state, action) => {
          state.atRisk.status = "succeeded";

          state.atRisk.list = action.payload.results;
        },
      )

      .addCase(
        fetchFacultyReport.pending,

        (state) => {
          state.faculty.status = "loading";
        },
      )

      .addCase(
        fetchFacultyReport.fulfilled,

        (state, action) => {
          state.faculty.status = "succeeded";

          state.faculty.list = action.payload.results;
        },
      )

      .addCase(
        fetchBatchReport.pending,

        (state) => {
          state.batches.status = "loading";
        },
      )

      .addCase(
        fetchBatchReport.fulfilled,

        (state, action) => {
          state.batches.status = "succeeded";

          state.batches.list = action.payload;
        },
      )

      .addCase(
        fetchStudentReport.pending,

        (state) => {
          state.student.status = "loading";
        },
      )

      .addCase(
        fetchStudentReport.fulfilled,

        (state, action) => {
          state.student.status = "succeeded";

          state.student.data = action.payload;
        },
      )

      .addMatcher(
        isRejected,

        (state, action) => {
          state.error = action.error?.message || "FETCH_ERROR";

          if (action.type.includes("attendanceSummary")) {
            state.attendanceSummary.status = "failed";
          }

          if (action.type.includes("studentAttendance")) {
            state.studentAttendance.status = "failed";
          }

          if (action.type.includes("performance")) {
            state.performance.status = "failed";
          }

          if (action.type.includes("atRisk")) {
            state.atRisk.status = "failed";
          }

          if (action.type.includes("faculty")) {
            state.faculty.status = "failed";
          }

          if (action.type.includes("batch")) {
            state.batches.status = "failed";
          }

          if (action.type.includes("student")) {
            state.student.status = "failed";
          }
        },
      );
  },
});

export const { clearReportsError } = reportsSlice.actions;

export default reportsSlice.reducer;
