import { Container } from "@/components/shared/primitives";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface RoadmapSectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

export function RoadmapSection({ children, className, id }: RoadmapSectionProps) {
  return (
    <section id={id} className={cn("py-20", className)}>
      <Container>{children}</Container>
    </section>
  );
}
