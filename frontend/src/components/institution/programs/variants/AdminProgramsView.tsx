import { ProgramManagementView } from "../widgets/ProgramManagementView";

export function AdminProgramsView() {
  return (
    <ProgramManagementView
      scope="admin"
      title="Programs"
      description="Manage academic programs, degree mapping, batches, sections, intake capacity, and subject structure."
    />
  );
}
