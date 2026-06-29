import { AssessmentManagementView } from "../widgets/AssessmentManagementView";

export function HodAssessmentsView() {
  return (
    <AssessmentManagementView
      scope="hod"
      title="Department assessments"
      description="Review department-scoped assessments, scores, and assignment windows."
    />
  );
}
