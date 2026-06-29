export interface TimeSlot {
  id: number;

  day: string;

  start_time: string;

  end_time: string;

  is_break: boolean;
}

export interface FacultySubjectAssignment {
  id: number;

  faculty: number;
  faculty_name: string;

  subject: number;
  subject_name: string;

  section: number;
  section_name: string;

  batch: number;
  batch_name: string;

  role: string;

  is_active: boolean;

  created_at: string;
}

export interface TimetableEntry {
  id: number;

  assignment: number;

  section: number;
  section_name: string;

  timeslot: number;

  day: string;

  start_time: string;

  end_time: string;

  faculty_name: string;

  subject_name: string;

  room: string;

  is_active: boolean;
}

export type ConflictType = "faculty_clash" | "room_clash";

export interface TimetableConflict {
  faculty_name: string;

  subject_name: string;

  day: string;

  start_time: string;

  end_time: string;

  conflict_type: ConflictType;

  details: string;
}

export interface SubstituteFacultyRequest {
  timetable_entry: number;

  substitute_faculty: number;

  date: string;

  reason?: string;
}
