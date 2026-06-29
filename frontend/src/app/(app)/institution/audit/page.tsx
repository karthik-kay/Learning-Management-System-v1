import { InstitutionRoutePlaceholder } from "@/components/institution/shared/InstitutionRoutePlaceholder";

export default function InstitutionAuditPage() {
  return (
    <InstitutionRoutePlaceholder
      title="Audit Log"
      description="Review append-only institution and department-scoped actions across people, academics, attendance, reports, and exports."
      eyebrow="Settings"
      actions={["Audit table", "Actor filters", "Action filters", "Detail drawer"]}
    />
  );
}
