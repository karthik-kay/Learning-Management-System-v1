"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

import { fetchDepartments } from "@/redux/institution/academic.slice";
import {
  fetchFacultyList,
  fetchStudentList,
} from "@/redux/institution/people.slice";

export function useInstitutionOverview() {
  const dispatch = useAppDispatch();

  const departments = useAppSelector(
    (s) => s.institutionAcademic.departments.list,
  );

  const deptStatus = useAppSelector(
    (s) => s.institutionAcademic.departments.status,
  );

  const faculty = useAppSelector((s) => s.institutionPeople.faculty.list);

  const facultyStatus = useAppSelector(
    (s) => s.institutionPeople.faculty.status,
  );

  const students = useAppSelector((s) => s.institutionPeople.students.list);

  const studentStatus = useAppSelector(
    (s) => s.institutionPeople.students.status,
  );

  useEffect(() => {
    if (deptStatus === "idle") dispatch(fetchDepartments());
    if (facultyStatus === "idle") dispatch(fetchFacultyList(undefined));
    if (studentStatus === "idle") dispatch(fetchStudentList(undefined));
  }, [deptStatus, facultyStatus, studentStatus, dispatch]);

  return {
    departments,
    faculty,
    students,
    isLoading:
      deptStatus === "loading" ||
      facultyStatus === "loading" ||
      studentStatus === "loading",
  };
}
