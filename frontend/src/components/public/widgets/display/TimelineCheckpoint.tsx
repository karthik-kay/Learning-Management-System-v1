import { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface TimelineCheckpointProps {
  children?: ReactNode;
  className?: string;
}

export function TimelineCheckpoint({
  children,
  className,
}: TimelineCheckpointProps) {
  return (
    <div
      className={cn(
        `
        flex
        h-10
        w-10
        items-center
        justify-center
        rounded-full
        border
        bg-background
        shrink-0
        `,
        className,
      )}
    >
      {children ?? (
        <div
          className="
            h-3
            w-3
            rounded-full
            bg-primary
          "
        />
      )}
    </div>
  );
}
