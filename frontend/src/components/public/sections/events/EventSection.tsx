import { Container, Stack } from "@/components/shared/primitives";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface EventSectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

export function EventSection({ children, className, id }: EventSectionProps) {
  return (
    <section id={id} className={cn("py-16 lg:py-20", className)}>
      <Container>
        <Stack gap={40}>{children}</Stack>
      </Container>
    </section>
  );
}
