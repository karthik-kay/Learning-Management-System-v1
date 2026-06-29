"use client";

import { Stack, Inline, Box } from "@/components/shared/primitives";
import { ReactNode } from "react";

interface StatCardBlockProps {
  title: string;
  value: string | number;
  subtitle?: string;
  stat?: string;
  icon?: ReactNode;
  className?: string;
}

export default function StatCardBlock({
  title,
  value,
  subtitle,
  stat,
  icon,
  className,
}: StatCardBlockProps) {
  return (
    <Box className={className}>
      <Stack gap={8}>
        {/* Top row: icon + optional stat */}
        {(icon || stat) && (
          <Inline justify="between" align="center">
            {icon && <Box>{icon}</Box>}
            {stat && <Box>{stat}</Box>}
          </Inline>
        )}

        {/* Value */}
        <div>{value}</div>

        {/* Title */}
        <div>{title}</div>

        {/* Subtitle */}
        {subtitle && <div>{subtitle}</div>}
      </Stack>
    </Box>
  );
}
