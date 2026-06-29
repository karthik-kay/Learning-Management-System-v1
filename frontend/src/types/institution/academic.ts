import { BaseModel } from "./common";

export interface Degree extends BaseModel {
  name: string;

  code: string;

  is_active: boolean;
}

export interface Department extends BaseModel {
  name: string;
  code: string;
  hod_name: string | null;
  description?: string;
  program_count: number;
  faculty_count: number;
  student_count: number;
}

export interface Program extends BaseModel {
  name: string;
  code: string;
  department?: number;
  department_name: string;
  degree?: number;
  degree_name: string;
  duration_semesters: number;
  intake_capacity?: number;
}

export interface AcademicBatch extends BaseModel {
  name: string;
  program?: number;
  program_name: string;
  start_year: number;
  end_year: number;
  status: "upcoming" | "ongoing" | "completed";
  current_semester?: number;
  intake_size?: number;
}

export interface Section extends BaseModel {
  name: string;
  batch?: number;
  batch_name: string;
  class_teacher?: number | null;
  class_teacher_name: string | null;
  capacity?: number;
}

export interface Subject extends BaseModel {
  name: string;
  code: string;
  program_name: string;
  subject_type: "theory" | "lab" | "project";
  semester: number;
  credits?: number;
}
