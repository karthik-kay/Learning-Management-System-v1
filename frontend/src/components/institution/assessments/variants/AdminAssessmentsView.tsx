import { AssessmentManagementView } from "../widgets/AssessmentManagementView";

export function AdminAssessmentsView() {
  return (
    <AssessmentManagementView
      scope="admin"
      title="Assessments"
      description="Manage evaluation components, assignments, marks, weightage, and submission review surfaces."
    />
  );
}
