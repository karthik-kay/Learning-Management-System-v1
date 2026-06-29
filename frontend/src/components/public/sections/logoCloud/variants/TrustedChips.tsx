import { ReactNode } from "react";

import { Grid } from "@/components/shared/primitives";

interface TrustedStatsGridProps {
  children: ReactNode;
  className?: string;
}

export function TrustedStatsGrid({
  children,
  className,
}: TrustedStatsGridProps) {
  return (
    <Grid
      gap={32}
      className={`
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-4
        ${className ?? ""}
      `}
    >
      {children}
    </Grid>
  );
}
