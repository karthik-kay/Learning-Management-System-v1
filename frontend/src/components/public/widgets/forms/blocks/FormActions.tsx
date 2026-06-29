import { ReactNode } from "react";

import { Inline } from "@/components/shared/primitives";

interface FormActionsProps {
  children: ReactNode;
}

export function FormActions({ children }: FormActionsProps) {
  return (
    <Inline justify="end" gap="md">
      {children}
    </Inline>
  );
}
