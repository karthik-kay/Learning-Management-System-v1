export interface Certificate {
  id: string;
  credential_id: string;
  student_name: string;
  course_title: string;
  course_slug: string | null;
  course_level: string | null;
  course_domain: string | null;
  faculty_name: string;
  total_duration: string;
  org: {
    name: string;
    ceo_name: string;
    ceo_title: string;
  };
  issued_at: string;
}
