import { InstitutionRoutePlaceholder } from "@/components/institution/shared/InstitutionRoutePlaceholder";

export default function InstitutionResourcesPage() {
  return (
    <InstitutionRoutePlaceholder
      title="Resources"
      description="Manage PDFs, slides, videos, links, and topic-level resources for institution courses."
      eyebrow="Academic"
      actions={["Resource library", "Course visibility", "Topic attachments", "Upload flow"]}
    />
  );
}
