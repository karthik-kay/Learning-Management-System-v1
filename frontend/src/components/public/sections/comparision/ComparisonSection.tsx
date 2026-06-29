import { Container, Stack } from "@/components/shared/primitives";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ComparisonSectionProps {
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
  id?: string;
}

export function ComparisonSection({
  title,
  description,
  children,
  className,
  id,
}: ComparisonSectionProps) {
  return (
    <section id={id} className={cn("py-16 lg:py-20", className)}>
      <Container>
        <Stack gap={40}>
          {(title || description) && (
            <Stack gap={10}>
              {description}
              {title}
            </Stack>
          )}

          {children}
        </Stack>
      </Container>
    </section>
  );
}
