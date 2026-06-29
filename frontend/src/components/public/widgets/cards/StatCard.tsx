import { ReactNode } from "react";

import { Box, Stack } from "@/components/shared/primitives";

interface StatCardProps {
  logo?: ReactNode;
  metric: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export default function StatCard({
  logo,
  metric,
  actions,
  className,
}: StatCardProps) {
  return (
    <Stack
      gap={16}
      className={`
        rounded-2xl
        border
        bg-card
        p-6
        ${className}
      `}
    >
      {logo && <Box>{logo}</Box>}

      <Box>{metric}</Box>

      {actions && <Box>{actions}</Box>}
    </Stack>
  );
}
