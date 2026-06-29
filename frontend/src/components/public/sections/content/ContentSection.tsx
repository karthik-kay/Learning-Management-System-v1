import { Container } from "@/components/shared/primitives";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ContentSectionProps {
  children: ReactNode;
  className?: string;
}

export function ContentSection({ children, className }: ContentSectionProps) {
  return (
    <section className={cn(className)}>
      <Container>{children}</Container>
    </section>
  );
}
