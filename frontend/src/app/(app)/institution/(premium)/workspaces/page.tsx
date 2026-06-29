import { InstitutionRoutePlaceholder } from "@/components/institution/shared/InstitutionRoutePlaceholder";

export default function InstitutionWorkspacesPage() {
  return (
    <InstitutionRoutePlaceholder
      title="IDE Workspaces"
      description="Monitor cloud IDE workspaces, workspace usage, limits, and premium-tier access."
      eyebrow="Premium"
      actions={["Workspace list", "Usage summary", "Limits", "Access status"]}
    />
  );
}
