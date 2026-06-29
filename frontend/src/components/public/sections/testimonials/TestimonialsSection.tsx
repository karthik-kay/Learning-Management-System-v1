// sections/testimonials/TestimonialsSection.tsx

import { ReactNode } from "react";

import { Container } from "@/components/shared/primitives";

interface TestimonialsSectionProps {
  children: ReactNode;

  className?: string;
}

export function TestimonialsSection({
  children,
  className,
}: TestimonialsSectionProps) {
  return (
    <section className={className}>
      <Container>{children}</Container>
    </section>
  );
}
