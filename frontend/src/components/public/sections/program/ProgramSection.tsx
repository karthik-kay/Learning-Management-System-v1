import { Container } from "@/components/shared/primitives";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ProgramSectionProps {
  children: ReactNode;
  className?: string;
}

export function ProgramSection({ children, className }: ProgramSectionProps) {
  return (
    <section className={cn("py-16 lg:py-24", className)}>
      <Container>{children}</Container>
    </section>
  );
}
