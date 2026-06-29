export interface AttendanceReport {
  student_name: string;

  enrollment_number: string;

  department: string;

  program: string;

  batch: string;

  total_classes: number;

  attended: number;

  attendance_percentage: number;

  is_shortage: boolean;
}

export interface SubjectAttendanceReport {
  subject_name: string;

  subject_code: string;

  total_classes: number;

  attended: number;

  attendance_percentage: number;
}

export interface PerformanceReport {
  student_name: string;

  enrollment_number: string;

  department: string;

  program: string;

  total_marks: number;

  avg_marks: number;

  grade: string;

  cgpa: number;
}

export interface FacultyActivityReport {
  faculty_name: string;

  employee_id: string;

  department: string;

  classes_scheduled: number;

  classes_conducted: number;

  attendance_submissions: number;

  subjects_assigned: number;
}

export interface BatchPerformanceReport {
  batch_name: string;

  program_name: string;

  total_students: number;

  avg_attendance: number;

  avg_marks: number;

  top_performer: string;

  shortage_count: number;
}

export interface CertificationReport {
  course_name: string;

  issued: number;

  pending: number;

  revoked: number;
}

export interface StudentProgressReport {
  student_name: string;

  enrollment_number: string;

  current_semester: number;

  overall_attendance: number;

  cgpa: number;

  subjects: Record<string, unknown>[];
}

export interface AtRiskStudent {
  id: number;

  name: string;

  enrollment_number: string;

  attendance: number;

  cgpa: number;

  risk_level: "low" | "medium" | "high";

  risk_reason: string;
}
