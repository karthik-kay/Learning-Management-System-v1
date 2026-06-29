import { ReactNode } from "react";

import { Box, Stack } from "@/components/shared/primitives";

export interface PeopleCardProps {
  image?: ReactNode;
  name: string;
  jobTitle: string;
  jobDescription: string;
  actions?: ReactNode;
  className?: string;
}

export function PeopleCard({
  image,
  name,
  jobTitle,
  jobDescription,
  actions,
  className,
}: PeopleCardProps) {
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
      <Stack
        gap={16}
        className="
        h-full
        rounded-xl
        border
        bg-card
        p-6
      "
      >
        {image && (
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
          </Box>
        )}

        <Stack gap={4}>
          <h3 className="font-semibold text-lg">{name}</h3>

          <p
            className="
            text-sm
            font-medium
            text-primary
          "
          >
            {jobTitle}
          </p>
        </Stack>

        <p
          className="
          flex-1
          text-sm
          text-muted-foreground
        "
        >
          {jobDescription}
        </p>

        {actions}
      </Stack>
    </Box>
  );
}
