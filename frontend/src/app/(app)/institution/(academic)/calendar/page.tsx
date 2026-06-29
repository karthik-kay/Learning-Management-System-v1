import { InstitutionRoutePlaceholder } from "@/components/institution/shared/InstitutionRoutePlaceholder";

export default function InstitutionCalendarPage() {
  return (
    <InstitutionRoutePlaceholder
      title="Academic Calendar"
      description="Set semester dates, holidays, exam weeks, academic events, and institution-wide calendar visibility."
      eyebrow="Academic"
      actions={["Semester dates", "Holidays", "Exam weeks", "Events"]}
    />
  );
}
