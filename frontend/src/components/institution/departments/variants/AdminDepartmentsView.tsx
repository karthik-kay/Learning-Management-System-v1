import { DepartmentManagementView } from "../widgets/DepartmentManagementView";

export function AdminDepartmentsView() {
  return (
    <DepartmentManagementView
      scope="admin"
      title="Departments"
      description="Manage departments, HOD ownership, academic program mapping, and institution structure hierarchy."
    />
  );
}
