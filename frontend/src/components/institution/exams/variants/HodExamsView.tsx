import { ExamManagementView } from "../widgets/ExamManagementView";

export function HodExamsView() {
  return (
    <ExamManagementView
      scope="hod"
      title="Department exams"
      description="Review department-scoped exams, publish windows, subjects, and result readiness."
    />
  );
}
