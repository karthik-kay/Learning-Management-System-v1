import { Container, Stack } from "@/components/shared/primitives";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface CareerSectionProps {
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
  id?: string;
}

export function CareerSection({
  title,
  description,
  children,
  className,
  id,
}: CareerSectionProps) {
  return (
    <section id={id} className={cn("py-16 lg:py-20", className)}>
      <Container>
        <Stack gap={40}>
          {(title || description) && (
            <Stack gap={12} align="center" className="text-center">
              {title}
              {description}
            </Stack>
          )}

          {children}
        </Stack>
      </Container>
    </section>
  );
}
