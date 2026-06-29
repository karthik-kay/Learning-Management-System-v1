import { createSlice, createAsyncThunk, isRejected } from "@reduxjs/toolkit";

import { djangoService } from "@/services/djangoService";

import {
  InstitutionFaculty,
  InstitutionFacultyDetail,
  InstitutionStudent,
  InstitutionStudentDetail,
} from "@/types/institution/people";
import { PaginatedResponse } from "@/types/institution/common";

type RequestStatus = "idle" | "loading" | "succeeded" | "failed";

interface PeopleState {
  faculty: {
    list: InstitutionFaculty[];
    detail: InstitutionFacultyDetail | null;

    status: RequestStatus;

    detailStatus: RequestStatus;
  };

  students: {
    list: InstitutionStudent[];

    detail: InstitutionStudentDetail | null;

    status: RequestStatus;

    detailStatus: RequestStatus;
  };

  error: string | null;
}

const initialState: PeopleState = {
  faculty: {
    list: [],

    detail: null,

    status: "idle",

    detailStatus: "idle",
  },

  students: {
    list: [],

    detail: null,

    status: "idle",

    detailStatus: "idle",
  },

  error: null,
};

export const fetchFacultyList = createAsyncThunk<
  PaginatedResponse<InstitutionFaculty>,
  Record<string, string> | undefined
>(
  "people/faculty",

  async (params) => {
    return await djangoService.getInstitutionFaculty(params);
  },
);

export const fetchFacultyDetail = createAsyncThunk<
  InstitutionFacultyDetail,
  number
>(
  "people/facultyDetail",

  async (id) => {
    return await djangoService.getInstitutionFacultyDetail(id);
  },
);

export const fetchStudentList = createAsyncThunk<
  PaginatedResponse<InstitutionStudent>,
  Record<string, string> | undefined
>(
  "people/students",

  async (params) => {
    return await djangoService.getInstitutionStudents(params);
  },
);

export const fetchStudentDetail = createAsyncThunk<
  InstitutionStudentDetail,
  number
>(
  "people/studentDetail",

  async (id) => {
    return await djangoService.getInstitutionStudent(id);
  },
);

const peopleSlice = createSlice({
  name: "people",

  initialState,

  reducers: {
    clearPeopleError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(
        fetchFacultyList.pending,

        (state) => {
          state.faculty.status = "loading";
        },
      )

      .addCase(
        fetchFacultyList.fulfilled,

        (state, action) => {
          state.faculty.status = "succeeded";

          state.faculty.list = action.payload.results;
        },
      )

      .addCase(
        fetchFacultyDetail.pending,

        (state) => {
          state.faculty.detailStatus = "loading";
        },
      )

      .addCase(
        fetchFacultyDetail.fulfilled,

        (state, action) => {
          state.faculty.detailStatus = "succeeded";

          state.faculty.detail = action.payload;
        },
      )

      .addCase(
        fetchStudentList.pending,

        (state) => {
          state.students.status = "loading";
        },
      )

      .addCase(
        fetchStudentList.fulfilled,

        (state, action) => {
          state.students.status = "succeeded";

          state.students.list = action.payload.results;
        },
      )

      .addCase(
        fetchStudentDetail.pending,

        (state) => {
          state.students.detailStatus = "loading";
        },
      )

      .addCase(
        fetchStudentDetail.fulfilled,

        (state, action) => {
          state.students.detailStatus = "succeeded";

          state.students.detail = action.payload;
        },
      )

      .addMatcher(
        isRejected,

        (state, action) => {
          state.error = action.error?.message || "FETCH_ERROR";
        },
      );
  },
});

export const { clearPeopleError } = peopleSlice.actions;

export default peopleSlice.reducer;
