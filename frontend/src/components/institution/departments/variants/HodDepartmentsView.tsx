import { DepartmentManagementView } from "../widgets/DepartmentManagementView";

export function HodDepartmentsView() {
  return (
    <DepartmentManagementView
      scope="hod"
      title="Department structure"
      description="Review your scoped academic structure, programs, batches, sections, and operational counts."
    />
  );
}
