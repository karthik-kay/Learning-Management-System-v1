import { ReactNode } from "react";

import { Stack } from "@/components/shared/primitives";

interface TimelineSectionProps {
  title?: string;
  description?: string;
  children: ReactNode;
}

export function TimelineSection({
  title,
  description,
  children,
}: TimelineSectionProps) {
  return (
    <Stack gap={32}>
      {(title || description) && (
        <Stack gap={8}>
          {title && <h2 className="font-bold">{title}</h2>}

          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </Stack>
      )}

      {children}
    </Stack>
  );
}
