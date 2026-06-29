import { GradesManagementView } from "../widgets/GradesManagementView";

export function AdminGradesView() {
  return (
    <GradesManagementView
      scope="admin"
      title="Grades & results"
      description="Review student performance, upload component scores, compute final grades, and publish verified results."
    />
  );
}
