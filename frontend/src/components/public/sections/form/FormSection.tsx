import { ReactNode } from "react";

import { Stack } from "@/components/shared/primitives";
import { cn } from "@/lib/utils";

interface FormSectionProps {
  title?: ReactNode;
  description?: ReactNode;
  className?: string;
  children: ReactNode;
}

export function FormSection({
  title,
  description,
  children,
  className,
}: FormSectionProps) {
  return (
    <section className={cn("py-16", className)}>
      <Stack gap="2xl">
        {title}
        {description}
        {children}
      </Stack>
    </section>
  );
}
