import { Children, ReactNode, isValidElement } from "react";

import { Inline, Stack } from "@/components/shared/primitives";

interface VerticalTimelineProps {
  children: ReactNode;
  checkpoint?: ReactNode;
}

export function VerticalTimeline({
  children,
  checkpoint,
}: VerticalTimelineProps) {
  const items = Children.toArray(children);

  return (
    <Stack gap={24}>
      {items.map((child, index) => {
        const isLast = index === items.length - 1;

        return (
          <Inline key={index} align="start" gap={16}>
            <Stack align="center" className="shrink-0">
              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  border
                  bg-background
                "
              >
                {checkpoint ?? (
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

              {!isLast && (
                <div
                  className="
                    mt-2
                    h-16
                    w-px
                    bg-border
                  "
                />
              )}
            </Stack>

            <div className="flex-1">{isValidElement(child) ? child : null}</div>
          </Inline>
        );
      })}
    </Stack>
  );
}
