// sections/contact/variants/ContactAudience.tsx

import { ReactNode } from "react";

import { Grid } from "@/components/shared/primitives";

interface ContactAudienceProps {
  children?: ReactNode;
  className?: string;
}

export function ContactAudience({ children, className }: ContactAudienceProps) {
  return (
    <Grid
      className={`
        grid-cols-1
        lg:grid-cols-3
        gap-8
        ${className ?? ""}
      `}
    >
      {children}
    </Grid>
  );
}
