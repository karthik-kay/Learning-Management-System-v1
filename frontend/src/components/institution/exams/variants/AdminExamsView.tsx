import { ExamManagementView } from "../widgets/ExamManagementView";

export function AdminExamsView() {
  return (
    <ExamManagementView
      scope="admin"
      title="Exams"
      description="Manage exam windows, batch schedules, publish status, subjects, and result visibility."
    />
  );
}
