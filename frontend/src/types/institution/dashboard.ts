export interface InstitutionDashboardData {
  total_departments: number;
  total_students: number;
  total_faculty: number;
  active_courses: number;
  avg_attendance: number;
  avg_performance: number;
  pending_certifications: number;
  active_placement_drives: number;
  students_placed_this_year: number;
  at_risk_students: number;
}

export interface HODDashboardData {
  department: string;
  total_students: number;
  today_attendance_percentage: number;
  shortage_count: number;
  pending_marks_entry: number;
  upcoming_exams: number;
  pending_leave_approvals: number;
  pending_internship_approvals: number;
}