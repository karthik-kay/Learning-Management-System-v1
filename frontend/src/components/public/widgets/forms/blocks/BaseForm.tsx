import { ReactNode } from "react";

import { Stack } from "@/components/shared/primitives";

interface BaseFormProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  children: ReactNode;
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
}

export function BaseForm({
  eyebrow,
  title,
  description,
  children,
  onSubmit,
}: BaseFormProps) {
  return (
    <form onSubmit={onSubmit}>
      <Stack gap={32}>
        {(eyebrow || title || description) && (
          <Stack gap={12}>
            {eyebrow && (
              <p className="text-xs font-semibold uppercase tracking-widest text-orange-500">
                {eyebrow}
              </p>
            )}

            {title && (
              <h3 className="text-3xl font-bold tracking-tight">{title}</h3>
            )}

            {description && (
              <p className="text-muted-foreground leading-relaxed">
                {description}
              </p>
            )}
          </Stack>
        )}

        {children}
      </Stack>
    </form>
  );
}
