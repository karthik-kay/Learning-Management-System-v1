import { InstitutionRoutePlaceholder } from "@/components/institution/shared/InstitutionRoutePlaceholder";

export default function InstitutionCommunityPage() {
  return (
    <InstitutionRoutePlaceholder
      title="Community"
      description="Manage institution channels, department spaces, discussions, and communication visibility."
      eyebrow="Communication"
      actions={["Channels", "Department spaces", "Moderation", "Announcements"]}
    />
  );
}
