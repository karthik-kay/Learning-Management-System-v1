import { Box, Inline, Stack } from "@/components/shared/primitives";

import { SplitHeroProps } from "../types";

export function SplitHero({
  badge,
  title,
  description,
  actions,
  stats,
  media,
  reverse = false,
}: SplitHeroProps) {
  return (
    <Inline
      align="center"
      justify="between"
      gap={64}
      className={`
          flex-col-reverse
          lg:flex-row
          ${reverse ? "lg:flex-row-reverse" : ""}
        `}
    >
      {/* Content */}
      <Box className="flex flex-col gap-16 flex-1 min-w-0">
        <Stack
          gap={32}
          className="
              text-center
              lg:text-left
            "
        >
          {badge && (
            <Box className="flex justify-center lg:justify-start">{badge}</Box>
          )}

          {title && <Box className="space-y-2">{title}</Box>}

          {description && (
            <Box className="max-w-2xl mx-auto lg:mx-0">{description}</Box>
          )}

          {actions && (
            <Box className="flex justify-center lg:justify-start">
              {actions}
            </Box>
          )}
        </Stack>

        {stats && <Box>{stats}</Box>}
      </Box>

      {/* Media */}
      {media && <Box className="flex-1 min-w-0">{media}</Box>}
    </Inline>
  );
}
