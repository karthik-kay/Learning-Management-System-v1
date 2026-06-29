import {
  CareerCard,
  CareerCardData,
} from "@/components/public/widgets/cards/CareerCard";
import { Stack } from "@/components/shared/primitives";

interface CareerPathGridProps {
  careers: CareerCardData[];
}

export function CareerPathGrid({ careers }: CareerPathGridProps) {
  return (
    <Stack gap={16}>
      {careers.map((career, index) => (
        <CareerCard key={career.title} career={career} index={index} />
      ))}
    </Stack>
  );
}
