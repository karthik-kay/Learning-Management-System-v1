import { BaseModel } from "./common";

export interface EvaluationComponent extends BaseModel {
  subject: number;
  subject_name: string;

  batch: number;
  batch_name: string;

  section: number | null;

  semester: number | null;

  name: string;

  component_type: string;

  max_marks: number;

  weightage: number;

  is_internal: boolean;
}

export interface StudentComponentScore {
  id: number;

  component: number;

  component_name: string | null;

  student: number;

  student_name: string | null;

  enrollment_number: string | null;

  marks_obtained: number;

  is_absent: boolean;
}

export interface Exam extends BaseModel {
  name: string;
  batch: number;
  batch_name?: string | null;
  exam_type: "midterm" | "final";
  start_date: string;
  end_date: string;
  is_published: boolean;
}

export interface ExamSubject {
  id: number;

  subject_name: string;

  exam_name: string;

  max_marks?: number | null;
}

export interface ExamResult {
  id: number;

  subject_name?: string | null;

  student_name: string;

  enrollment_number: string;

  marks_obtained: number;

  is_absent: boolean;

  max_marks: number | null;
}

export interface SubjectResult {
  id: number;

  student: number;

  student_name: string | null;

  enrollment_number: string | null;

  subject: number;

  subject_name: string | null;

  credits: number | null;

  internal_marks: number;

  external_marks: number;

  total_marks: number;

  grade: string;

  grade_point: number;
}

export interface StudentCGPA {
  student_name: string;

  enrollment_number: string;

  cgpa: number;
}

export interface Assignment extends BaseModel {
  component?: number;

  component_name?: string | null;

  title: string;

  subject_name: string;

  description?: string;

  due_date: string;
}

export interface Submission {
  id: number;

  student_name: string;

  assignment_title: string;

  marks?: number;

  submitted_at: string;
}

export interface ComputeSubjectResultPayload {
  student: number;
  subject: number;
  internal_marks: number;
  external_marks: number;
}
