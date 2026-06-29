import { Container } from "@/components/shared/primitives";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface CTASectionProps {
  children: ReactNode;
  className?: string;
}

export function CTASection({ children, className }: CTASectionProps) {
  return (
    <section className={cn(className)}>
      <Container>{children}</Container>
    </section>
  );
}
