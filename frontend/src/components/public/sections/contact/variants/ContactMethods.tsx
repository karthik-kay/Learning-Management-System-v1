import { ReactNode } from "react";

import { Grid } from "@/components/shared/primitives";

interface ContactMethodsProps {
  children?: ReactNode;
}

export function ContactMethods({ children }: ContactMethodsProps) {
  return (
    <Grid
      className="
          grid-cols-1
          md:grid-cols-2
          lg:grid-cols-4
          gap-8
        "
    >
      {children}
    </Grid>
  );
}
