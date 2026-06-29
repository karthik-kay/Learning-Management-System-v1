import { ReactNode } from "react";

import { Box, Stack } from "@/components/shared/primitives";

interface MentorCardProps {
  image?: ReactNode;
  role?: ReactNode;
  name: ReactNode;
  company?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function MentorCard({
  image,
  role,
  name,
  company,
  actions,
  className,
}: MentorCardProps) {
  return (
    <Box
      className={`
        group
        rounded-3xl
        border-4
        bg-white
        overflow-hidden
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-orange-500
        hover:shadow-lg
        ${className ?? ""}
      `}
    >
      <Stack gap={20}>
        {/* Image */}
        <Box className="relative overflow-hidden">
          <Box
            className="
              transition-transform
              duration-700
              ease-out
              group-hover:scale-110
            "
          >
            {image}
          </Box>

          {role && (
            <Box
              className="
                absolute
                bottom-4
                left-4
                z-10
              "
            >
              {role}
            </Box>
          )}
        </Box>

        {/* Content */}
        <Stack gap={8} className="px-6 pb-6">
          <Box>{name}</Box>

          {company && <Box>{company}</Box>}

          {actions && <Box className="pt-2">{actions}</Box>}
        </Stack>
      </Stack>
    </Box>
  );
}
