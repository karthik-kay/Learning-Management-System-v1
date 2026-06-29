import { FacultyFullProfileView } from "@/components/institution/faculty/widgets/FacultyFullProfileView";

interface InstitutionFacultyProfilePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function InstitutionFacultyProfilePage({
  params,
}: InstitutionFacultyProfilePageProps) {
  const { id } = await params;
  const facultyId = Number(id);

  return <FacultyFullProfileView facultyId={facultyId} />;
}
