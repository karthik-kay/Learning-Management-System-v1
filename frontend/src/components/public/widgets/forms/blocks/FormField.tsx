import { ReactNode } from "react";

import { Stack } from "@/components/shared/primitives";
import { Label } from "@/components/ui/label";

interface FormFieldProps {
  label: string;
  required?: boolean;
  description?: string;
  error?: string;
  children: ReactNode;
}

export function FormField({
  label,
  required,
  description,
  error,
  children,
}: FormFieldProps) {
  return (
    <Stack gap={6}>
      <Label>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>

      {description && (
        <p className="text-muted-foreground text-sm">{description}</p>
      )}

      {children}

      {error && <p className="text-destructive text-sm">{error}</p>}
    </Stack>
  );
}
