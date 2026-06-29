import { AcademicNodeDetailView } from "@/components/institution/structure/AcademicNodeDetailView";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function InstitutionSectionDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <AcademicNodeDetailView kind="section" id={Number(id)} />;
}
