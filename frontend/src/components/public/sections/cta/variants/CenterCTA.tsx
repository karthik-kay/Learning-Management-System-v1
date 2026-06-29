import { Box, Inline, Stack } from "@/components/shared/primitives";
import { ReactNode } from "react";

interface CenterCTAProps {
  eyebrow?: ReactNode;
  title: ReactNode;
  description: ReactNode;
  primaryAction: ReactNode;
  secondaryAction?: ReactNode;
  className?: string;
}

export default function CenterCTA({
  eyebrow,
  title,
  description,
  primaryAction,
  secondaryAction,
  className,
}: CenterCTAProps) {
  return (
    <Stack
      align="center"
      gap={24}
      className={`max-w-7xl mx-auto text-center ${className}`}
    >
      {eyebrow && (
        <Box>
          <span className="text-xs font-semibold uppercase tracking-widest text-orange-500">
            {eyebrow}
          </span>
        </Box>
      )}

      <Box>
        <h2 className="text-3xl sm:text-2xl font-bold tracking-tight leading-tight">
          {title}
        </h2>
      </Box>

      <Box>
        <p className="text-base text-muted-foreground leading-relaxed max-w-xl mx-auto">
          {description}
        </p>
      </Box>

      <Inline gap={12}>
        {primaryAction}
        {secondaryAction}
      </Inline>
    </Stack>
  );
}
