// sections/mentor/MentorSection.tsx

import { ReactNode } from "react";

import { Container } from "@/components/shared/primitives";

interface MentorSectionProps {
  children: ReactNode;

  className?: string;
}

export function MentorSection({ children, className }: MentorSectionProps) {
  return (
    <section className={className}>
      <Container>{children}</Container>
    </section>
  );
}
