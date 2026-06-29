import { FacultyManagementView } from "../widgets/FacultyManagementView";

export function AdminFacultyView() {
  return (
    <FacultyManagementView
      scope="admin"
      title="Faculty"
      description="Manage faculty lifecycle, department assignment, HOD roles, account status, and institution-wide faculty exports."
    />
  );
}
