import { InstitutionRoutePlaceholder } from "@/components/institution/shared/InstitutionRoutePlaceholder";

export default function InstitutionCertificationsPage() {
  return (
    <InstitutionRoutePlaceholder
      title="Certifications"
      description="Review pending certificates, issue or revoke certifications, and export certification reports."
      eyebrow="Academic"
      actions={["Pending certificates", "Issue/revoke", "Bulk approve", "Certification report"]}
    />
  );
}
