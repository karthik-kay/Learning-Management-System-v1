export interface InstitutionStudent {
  id: number;

  name: string;

  email: string;

  enrollment_number: string;

  department_name: string;

  program_name: string;

  batch_name: string;

  section_name: string | null;

  current_semester: number;

  status: string;
}

export interface InstitutionStudentDetail {
  id: number;

  name: string;

  email: string;

  phone: string | null;

  enrollment_number: string;

  current_semester: number;

  department_name: string;

  program_name: string;

  batch_name: string;

  section_name: string | null;

  admission_date: string;

  status: string;

  created_at: string;

  updated_at: string;
}

export interface InstitutionFaculty {
  id: number;

  name: string;

  email: string;

  employee_id: string;

  department_name: string;

  designation: string;

  status: string;
}

export interface InstitutionFacultyDetail {
  id: number;

  name: string;

  email: string;

  phone: string | null;

  employee_id: string;

  designation: string;

  status: string;

  department_name: string;

  institution_name: string;

  joining_date: string;

  created_at: string;

  updated_at: string;
}
