import { AcademicNodeDetailView } from "@/components/institution/structure/AcademicNodeDetailView";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function InstitutionProgramDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <AcademicNodeDetailView kind="program" id={Number(id)} />;
}
