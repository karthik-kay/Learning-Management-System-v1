import { StudentManagementView } from "../widgets/StudentManagementView";

export function AdminStudentsView() {
  return (
    <StudentManagementView
      scope="admin"
      title="Students"
      description="Manage every student in the institution, review enrollment details, filter by academic structure, and run status actions from one directory."
    />
  );
}
