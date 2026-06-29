import { AcademicNodeDetailView } from "@/components/institution/structure/AcademicNodeDetailView";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function InstitutionBatchDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <AcademicNodeDetailView kind="batch" id={Number(id)} />;
}
