import { Grid } from "@/components/shared/primitives";
import { GridProps } from "../types";

export function TwoColumnGrid({ children, className }: GridProps) {
  return (
    <Grid
      gap={32}
      className={`
        grid-cols-1
        lg:grid-cols-2
        ${className ?? ""}
      `}
    >
      {children}
    </Grid>
  );
}
