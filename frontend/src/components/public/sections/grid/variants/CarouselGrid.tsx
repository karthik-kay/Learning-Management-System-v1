import { Inline } from "@/components/shared/primitives";
import { GridProps } from "../types";

export function CarouselGrid({ children, className }: GridProps) {
  return (
    <Inline gap={24} scroll="x" className={className}>
      {children}
    </Inline>
  );
}
