import { Container, Stack } from "@/components/shared/primitives";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface LegalSectionProps {
  children: ReactNode;
  className?: string;
}

export function LegalSection({ children, className }: LegalSectionProps) {
  return (
    <section className={cn("py-16 lg:py-20", className)}>
      <Container>
        <Stack gap={40}>{children}</Stack>
      </Container>
    </section>
  );
}
