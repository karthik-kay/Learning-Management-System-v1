import { Container } from "@/components/shared/primitives";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface CommunitySectionProps {
  children: ReactNode;
  className?: string;
}

export function CommunitySection({
  children,
  className,
}: CommunitySectionProps) {
  return (
    <section className={cn(className)}>
      <Container>{children}</Container>
    </section>
  );
}
