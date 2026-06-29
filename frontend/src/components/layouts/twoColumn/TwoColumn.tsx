import { ReactNode } from "react";
import { Grid } from "@/components/shared/primitives";

type ColumnRatio = "2:1" | "3:1" | "4:1";

interface TwoColumnProps {
  children: ReactNode;
  sidebar: ReactNode;
  ratio?: ColumnRatio;
  gap?: number;
}

const ratioMap: Record<ColumnRatio, string> = {
  "2:1": "2fr 1fr",
  "3:1": "3fr 1fr",
  "4:1": "4fr 1fr",
};

export function TwoColumn({
  children,
  sidebar,
  ratio = "3:1",
  gap = 32,
}: TwoColumnProps) {
  return (
    <Grid columns={ratioMap[ratio]} gap={gap}>
      {children}
      {sidebar}
    </Grid>
  );
}
