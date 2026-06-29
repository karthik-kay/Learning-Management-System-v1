// components/learning/ContinueLearningCarousel.tsx
"use client";

import { ScrollArea } from "@/components/ui/scroll-area";

interface Props {
  children: React.ReactNode;
}

export function ContinueLearningCarousel({ children }: Props) {
  return (
    <ScrollArea className="w-full pb-2">
      <div className="flex flex-col gap-4 pr-4">{children}</div>
    </ScrollArea>
  );
}
