// sections/faq/FAQSection.tsx

import { ReactNode } from "react";

import { Container } from "@/components/shared/primitives";

interface FAQSectionProps {
  children: ReactNode;

  className?: string;
}

export function FAQSection({ children, className }: FAQSectionProps) {
  return (
    <section className={className}>
      <Container>{children}</Container>
    </section>
  );
}
