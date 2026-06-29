import { Children, ReactNode } from "react";

import { Stack } from "@/components/shared/primitives";

import { TimelineCheckpoint } from "../../../widgets/display/TimelineCheckpoint";

interface HorizontalTimelineProps {
  children: ReactNode;
  checkpoint?: ReactNode;
}

export function HorizontalTimeline({
  children,
  checkpoint,
}: HorizontalTimelineProps) {
  const items = Children.toArray(children);

  return (
    <div
      className="
        grid
        gap-8
        md:grid-cols-3
      "
    >
      {items.map((item, index) => (
        <Stack key={index} gap={16} className="relative">
          <div
            className="
              flex
              items-center
            "
          >
            <TimelineCheckpoint>{checkpoint}</TimelineCheckpoint>

            {index < items.length - 1 && (
              <div
                className="
                  flex-1
                  h-px
                  bg-border
                "
              />
            )}
          </div>

          {item}
        </Stack>
      ))}
    </div>
  );
}
