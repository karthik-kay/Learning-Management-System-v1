import { ReactNode } from "react";
import { Box } from "./Box";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  // sm   → max-w-sm   384px  — auth forms, narrow cards
  // md   → max-w-3xl  768px  — blog posts, legal docs
  // lg   → max-w-5xl  1024px — focused content pages
  // xl   → max-w-7xl  1280px — standard page content (default)
  // full → max-w-none — no constraint, section handles width
}

const sizeMap: Record<NonNullable<ContainerProps["size"]>, string> = {
  sm: "max-w-sm",
  md: "max-w-3xl",
  lg: "max-w-5xl",
  xl: "max-w-7xl",
  full: "max-w-none",
};

export function Container({
  children,
  className,
  size = "xl",
}: ContainerProps) {
  return (
    <Box
      className={`w-full ${sizeMap[size]} mx-auto px-4 sm:px-6 lg:px-8 ${className ?? ""}`}
    >
      {children}
    </Box>
  );
}
