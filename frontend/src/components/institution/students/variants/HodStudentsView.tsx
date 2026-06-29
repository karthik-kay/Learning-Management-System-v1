import { StudentManagementView } from "../widgets/StudentManagementView";

export function HodStudentsView() {
  return (
    <StudentManagementView
      scope="hod"
      title="Department students"
      description="Review students scoped to your department, track section and batch placement, and open each profile for attendance visibility."
    />
  );
}
