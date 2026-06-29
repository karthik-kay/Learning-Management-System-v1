// widgets/cards/ProgramCard.tsx

import { ReactNode } from "react";

import { Box, Stack, Inline } from "@/components/shared/primitives";

interface ProgramCardProps {
  icon?: ReactNode;

  title: ReactNode;

  audience?: ReactNode;

  description?: ReactNode;

  features?: ReactNode;

  cohort?: ReactNode;

  actions?: ReactNode;

  className?: string;
}

export function ProgramCard({
  icon,
  title,
  audience,
  description,
  features,
  cohort,
  actions,
  className,
}: ProgramCardProps) {
  return (
    <Box
      className={`
        rounded-3xl
        border
        bg-white
        p-8
        transition-all
        duration-200
        hover:-translate-y-1
        hover:border-orange-500
        ${className ?? ""}
      `}
    >
      <Stack gap={32} justify="start">
        {/* Header */}
        <Stack gap={20}>
          {icon && <Box>{icon}</Box>}

          <Stack gap={12}>
            <Box>{title}</Box>

            {audience && (
              <Inline justify="start" gap={8} wrap>
                {audience}
              </Inline>
            )}

            {description && <Box>{description}</Box>}
          </Stack>
        </Stack>

        {/* Features */}
        {features && (
          <Stack gap={12}>
            <h4 className="font-semibold">What You&apos;ll Unlock</h4>

            <Box>{features}</Box>
          </Stack>
        )}

        {/* Cohort */}
        {cohort && (
          <Box
            className="
              border-t
              pt-6
            "
          >
            {cohort}
          </Box>
        )}

        <Inline justify="start">
          {/* CTA */}
          {actions && <Box>{actions}</Box>}
        </Inline>
      </Stack>
    </Box>
  );
}
