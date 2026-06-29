import { InstitutionRoutePlaceholder } from "@/components/institution/shared/InstitutionRoutePlaceholder";

export default function InstitutionSettingsPage() {
  return (
    <InstitutionRoutePlaceholder
      title="Settings"
      description="Manage institution profile display, academic defaults, module visibility, and account-level preferences."
      eyebrow="Settings"
      actions={["Institution profile", "Academic defaults", "Module access", "Preferences"]}
    />
  );
}
