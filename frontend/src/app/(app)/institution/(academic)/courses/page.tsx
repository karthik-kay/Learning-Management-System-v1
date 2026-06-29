import { InstitutionRoutePlaceholder } from "@/components/institution/shared/InstitutionRoutePlaceholder";

export default function InstitutionCoursesPage() {
  return (
    <InstitutionRoutePlaceholder
      title="Courses"
      description="Create and manage institution courses, faculty assignment, visibility, syllabus, modules, and resources."
      eyebrow="Academic"
      actions={["Course list", "Publish/archive", "Faculty assignment", "Syllabus editor"]}
    />
  );
}
