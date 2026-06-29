// widgets/display/LogoChip.tsx

import { ReactNode } from "react";

import { Box } from "@/components/shared/primitives";

interface LogoChipProps {
  children: ReactNode;

  className?: string;
}

export function LogoChip({ children, className }: LogoChipProps) {
  return (
    <Box
      className={`
        flex
        items-center
        justify-center
        rounded-xl
        border
        bg-white
        px-6
        py-3
        text-sm
        font-semibold
        text-slate-700
        transition-all
        duration-200
        hover:border-orange-500
        hover:text-orange-500
        ${className ?? ""}
      `}
    >
      {children}
    </Box>
  );
}
