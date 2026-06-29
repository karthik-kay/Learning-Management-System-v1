import { FacultyManagementView } from "../widgets/FacultyManagementView";

export function HodFacultyView() {
  return (
    <FacultyManagementView
      scope="hod"
      title="Department faculty"
      description="Review faculty scoped to your department and inspect profiles, activity, and account status."
    />
  );
}
