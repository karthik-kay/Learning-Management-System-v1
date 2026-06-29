import { InstitutionRoutePlaceholder } from "@/components/institution/shared/InstitutionRoutePlaceholder";

export default function InstitutionLiveClassesPage() {
  return (
    <InstitutionRoutePlaceholder
      title="Live Classes"
      description="Schedule live sessions, review recordings, track attendance, and send class reminders for eligible tiers."
      eyebrow="Premium"
      actions={["Class schedule", "Recordings", "Reminders", "Attendance"]}
    />
  );
}
