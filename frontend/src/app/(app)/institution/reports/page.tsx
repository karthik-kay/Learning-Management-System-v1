import { InstitutionRoutePlaceholder } from "@/components/institution/shared/InstitutionRoutePlaceholder";

export default function InstitutionReportsPage() {
  return (
    <InstitutionRoutePlaceholder
      title="Reports"
      description="View attendance, performance, faculty activity, batch performance, student progress, and certification reports."
      eyebrow="Reports"
      actions={["Attendance report", "Performance report", "Faculty activity", "Student progress"]}
    />
  );
}
