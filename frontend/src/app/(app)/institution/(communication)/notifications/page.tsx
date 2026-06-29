import { InstitutionRoutePlaceholder } from "@/components/institution/shared/InstitutionRoutePlaceholder";

export default function InstitutionNotificationsPage() {
  return (
    <InstitutionRoutePlaceholder
      title="Notifications"
      description="Send scoped broadcasts, review delivery status, and manage institution notification activity."
      eyebrow="Communication"
      actions={["Broadcasts", "Delivery status", "Templates later", "Unread summary"]}
    />
  );
}
