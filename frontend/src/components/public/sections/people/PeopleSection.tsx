import { ReactNode } from "react";

import { Container, Box, Stack } from "@/components/shared/primitives";
import { cn } from "@/lib/utils";

interface PeopleSectionProps {
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function PeopleSection({
  title,
  description,
  actions,
  children,
  className,
}: PeopleSectionProps) {
  return (
    <section className={cn("py-16 lg:py-24", className)}>
      <Container>
        <Stack gap={48}>
          {(title || description || actions) && (
            <Stack gap={16} align="center" className="text-center">
              {title && <Box>{title}</Box>}

              {description && <Box>{description}</Box>}

              {actions && <Box>{actions}</Box>}
            </Stack>
          )}

          {children}
        </Stack>
      </Container>
    </section>
  );
}
