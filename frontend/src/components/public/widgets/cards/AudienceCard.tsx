// widgets/cards/AudienceCard.tsx

import { ReactNode } from "react";

import { Box, Stack, Inline } from "@/components/shared/primitives";

interface AudienceCardProps {
  icon?: ReactNode;

  title: ReactNode;

  description?: ReactNode;

  features?: ReactNode;

  actions?: ReactNode;

  className?: string;
}

export function AudienceCard({
  icon,
  title,
  description,
  features,
  actions,
  className,
}: AudienceCardProps) {
  return (
    <Box
      className={`
        h-full
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
      <Stack className="h-full" gap={24}>
        {/* Header */}
        <Stack gap={16}>
          {icon && (
            <Box
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-slate-50
              "
            >
              {icon}
            </Box>
          )}

          <Stack gap={12}>
            <Box>{title}</Box>

            {description && (
              <Box className="text-sm text-muted-foreground">{description}</Box>
            )}
          </Stack>
        </Stack>

        {/* Features */}
        {features && <Stack gap={12}>{features}</Stack>}

        {/* Push CTA to bottom */}
        <Box className="mt-auto">{actions}</Box>
      </Stack>
    </Box>
  );
}
