import { ReactNode } from "react";

import { Box, Grid } from "@/components/shared/primitives";

interface SplitContentProps {
  left: ReactNode;
  right: ReactNode;
  reverse?: boolean;
}

export function SplitContent({
  left,
  right,
  reverse = false,
}: SplitContentProps) {
  return (
    <Grid
      gap={64}
      align="start"
      className={`
        grid-cols-1
        lg:grid-cols-2
        ${reverse ? "lg:[&>*:first-child]:order-2" : ""}
      `}
    >
      {reverse ? (
        <>
          <Box>{left}</Box>

          <Box>{right}</Box>
        </>
      ) : (
        <>
          <Box>{right}</Box>

          <Box>{left}</Box>
        </>
      )}
    </Grid>
  );
}
