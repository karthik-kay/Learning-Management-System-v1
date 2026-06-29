import type { ReactNode } from "react";

import { Box } from "@/components/shared/primitives";
import { cn } from "@/lib/utils";

interface Props {
  children: ReactNode;

  className?: string;
}

export default function KpiCard({
  children,

  className,
}: Props) {
  return (
    <Box
      className={cn(
        `
          rounded-2xl
          border
          bg-card
          p-4
          shadow-sm
        `,
        className,
      )}
    >
      {children}
    </Box>
  );
}
