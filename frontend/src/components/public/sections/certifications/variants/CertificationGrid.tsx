import {
  CertificationCard,
  CertificationCardData,
} from "@/components/public/widgets/cards/CertificationCard";
import { Grid } from "@/components/shared/primitives";

interface CertificationGridProps {
  certifications: CertificationCardData[];
}

export function CertificationGrid({ certifications }: CertificationGridProps) {
  return (
    <Grid className="grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {certifications.map((certification) => (
        <CertificationCard
          key={certification.id}
          certification={certification}
        />
      ))}
    </Grid>
  );
}
