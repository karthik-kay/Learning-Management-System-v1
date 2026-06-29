import { AcademicNodeDetailView } from "@/components/institution/structure/AcademicNodeDetailView";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function InstitutionDepartmentDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <AcademicNodeDetailView kind="department" id={Number(id)} />;
}
