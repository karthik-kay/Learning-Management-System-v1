import { ReactNode } from "react";
import { Grid } from "@/components/shared/primitives";

type SplitRatio = "1:1" | "2:1" | "1:2";

interface SplitProps {
  left: ReactNode;
  right: ReactNode;
  ratio?: SplitRatio;
  gap?: number;
}

const ratioMap: Record<SplitRatio, string> = {
  "1:1": "1fr 1fr",
  "2:1": "2fr 1fr",
  "1:2": "1fr 2fr",
};

export function Split({ left, right, ratio = "1:1", gap = 32 }: SplitProps) {
  return (
    <Grid columns={ratioMap[ratio]} gap={gap}>
      {left}
      {right}
    </Grid>
  );
}
