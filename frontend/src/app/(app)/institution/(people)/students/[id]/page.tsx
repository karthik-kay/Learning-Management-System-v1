import { StudentFullProfileView } from "@/components/institution/students/widgets/StudentFullProfileView";

interface InstitutionStudentProfilePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function InstitutionStudentProfilePage({
  params,
}: InstitutionStudentProfilePageProps) {
  const { id } = await params;
  const studentId = Number(id);

  return <StudentFullProfileView studentId={studentId} />;
}
