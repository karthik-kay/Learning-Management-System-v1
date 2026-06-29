import { GradesManagementView } from "../widgets/GradesManagementView";

export function HodGradesView() {
  return (
    <GradesManagementView
      scope="hod"
      title="Department grades"
      description="Review department performance, upload marks, compute subject grades, and publish verified results."
    />
  );
}
