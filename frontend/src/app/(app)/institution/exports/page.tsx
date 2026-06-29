import { InstitutionRoutePlaceholder } from "@/components/institution/shared/InstitutionRoutePlaceholder";

export default function InstitutionExportsPage() {
  return (
    <InstitutionRoutePlaceholder
      title="Exports"
      description="Track async export jobs, generation status, download links, filters, and audit visibility."
      eyebrow="Reports"
      actions={["Export jobs", "Create export", "Download links", "Status tracking"]}
    />
  );
}
