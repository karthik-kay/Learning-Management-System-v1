import { ReactNode } from "react";
import { Box } from "@/components/shared/primitives";

interface SystemLayoutProps {
  children: ReactNode;
  className?: string;
}

// Used by: not-found.tsx, error.tsx, /maintenance
// No navbar. No footer. Full screen centred.
// User is in an error state — keep it clean, show recovery action only.
export function SystemLayout({ children, className }: SystemLayoutProps) {
  return (
    <Box
      className={`min-h-screen flex items-center justify-center p-6 bg-white ${className ?? ""}`}
    >
      <Box className="w-full max-w-[480px] text-center">{children}</Box>
    </Box>
  );
}
