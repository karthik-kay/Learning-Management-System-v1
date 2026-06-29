// widgets/cards/ContactCard.tsx

import { ReactNode } from "react";

import { Box, Stack } from "@/components/shared/primitives";

interface ContactCardProps {
  icon?: ReactNode;

  title?: ReactNode;

  description?: ReactNode;

  action?: ReactNode;

  className?: string;
}

export function ContactCard({
  icon,
  title,
  description,
  action,
  className,
}: ContactCardProps) {
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
      <Stack gap={20}>
        {icon}

        {title}

        {description}

        {action}
      </Stack>
    </Box>
  );
}
