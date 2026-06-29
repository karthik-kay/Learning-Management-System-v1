import { ProgramManagementView } from "../widgets/ProgramManagementView";

export function HodProgramsView() {
  return (
    <ProgramManagementView
      scope="hod"
      title="Department programs"
      description="Review programs scoped to your department with batches, sections, and subjects attached."
    />
  );
}
