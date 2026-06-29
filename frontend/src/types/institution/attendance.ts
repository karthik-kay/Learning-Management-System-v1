export interface AttendanceSession {
  id: number;
  timetable_entry: number;
  subject_name: string | null;
  faculty_name: string | null;
  section_name: string | null;
  date: string;
  topic?: string;
  is_cancelled: boolean;
  created_at: string;
}

export interface AttendanceRecord {
  id: number;
  session: number;
  student: number;
  student_name: string | null;
  enrollment_number: string | null;
  status: "present" | "absent" | "late";
  remarks?: string;
}

export interface AttendanceShortage {
  student_name: string;
  enrollment_number: string;
  department: string;
  total_classes: number;
  attended: number;
  attendance_percentage: number;
  shortage: number;
}

export interface LeaveApplication {
  id: number;
  student: number | null;
  faculty: number | null;
  applicant_type: "student" | "faculty";
  applicant_name: string | null;
  applicant_identifier: string | null;
  department_name: string | null;
  batch_name: string | null;
  section_name: string | null;
  from_date: string;
  to_date: string;
  reason: string;
  document_url?: string | null;
  attachment?: string | null;
  status: "pending" | "approved" | "rejected" | "cancelled";
  reviewed_by_name?: string | null;
  reviewed_at?: string | null;
  review_note?: string;
  affected_sessions: number;
  recorded_absences: number;
  created_at: string;
  updated_at: string;
}

export interface LeaveDecisionPayload {
  decision: "approved" | "rejected";
  review_note?: string;
}
