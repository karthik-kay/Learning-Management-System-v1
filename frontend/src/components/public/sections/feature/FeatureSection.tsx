import type { ReactNode } from "react";

import { Container, Stack } from "@/components/shared/primitives";
import { cn } from "@/lib/utils";

interface FeatureSectionProps {
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function FeatureSection({
  title,
  description,
  children,
  className,
}: FeatureSectionProps) {
  return (
    <section className={cn("py-16 lg:py-24", className)}>
      <Container>
        <Stack gap={48}>
          {(title || description) && (
            <Stack gap={16} align="center" className="text-center">
              <Stack gap={16} align="center" className="max-w-3xl">
                {title}
                {description}
              </Stack>
            </Stack>
          )}

          {children}
        </Stack>
      </Container>
    </section>
  );
}
