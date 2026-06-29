import { Grid } from "@/components/shared/primitives";
import { GridProps } from "../types";

export function ThreeColumnGrid({ children, className }: GridProps) {
  return (
    <Grid
      gap={32}
      className={`
        grid-cols-1
        md:grid-cols-2
        lg:grid-cols-3
        ${className ?? ""}
      `}
    >
      {children}
    </Grid>
  );
}
