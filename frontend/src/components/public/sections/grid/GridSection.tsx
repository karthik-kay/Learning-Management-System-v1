import { ReactNode } from "react";

import { Container, Stack } from "@/components/shared/primitives";
import { cn } from "@/lib/utils";

interface GridSectionProps {
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
  id?: string;
}

export function GridSection({
  title,
  description,
  children,
  className,
  id,
}: GridSectionProps) {
  return (
    <section id={id} className={cn("py-16 lg:py-24", className)}>
      <Container>
        <Stack gap={48}>
          {(title || description) && (
            <Stack gap={16} align="center" className="text-center">
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
