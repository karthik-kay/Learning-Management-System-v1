import { ReactNode } from "react";
import { Stack } from "@/components/shared/primitives";

interface MarketingLayoutProps {
  children: ReactNode;
  className?: string;
}

export function MarketingLayout({ children, className }: MarketingLayoutProps) {
  return (
    <Stack
      justify="start"
      gap={0}
      className={`min-h-screen ${className ?? ""}`}
    >
      <Stack className="gap-16 lg:gap-24">{children}</Stack>
    </Stack>
  );
}
