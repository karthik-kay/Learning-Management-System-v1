import { ReactNode } from "react";

import { Stack } from "@/components/shared/primitives";
import { cn } from "@/lib/utils";

interface TimelineItemProps {
  variant?: "text" | "image";

  label?: string;
  title: string;
  description?: string;

  image?: ReactNode;

  className?: string;
}

export function TimelineItem({
  variant = "text",
  label,
  title,
  description,
  image,
  className,
}: TimelineItemProps) {
  if (variant === "image") {
    return (
      <Stack gap={16} className={cn("items-center text-center", className)}>
        {image && <div className="w-full">{image}</div>}

        <Stack gap={8}>
          <h3 className="text-xl font-semibold">{title}</h3>

          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </Stack>
      </Stack>
    );
  }

  return (
    <Stack gap={4} className={className}>
      {label && (
        <p className="text-xs font-semibold uppercase tracking-widest text-orange-500">
          {label}
        </p>
      )}

      <h3 className="text-lg font-bold">{title}</h3>

      {description && (
        <p className="text-muted-foreground text-sm leading-relaxed">
          {description}
        </p>
      )}
    </Stack>
  );
}
