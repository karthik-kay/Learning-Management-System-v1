// sections/program/variants/FeaturedPrograms.tsx

import { ReactNode } from "react";

import { Stack, Grid } from "@/components/shared/primitives";

interface FeaturedProgramsProps {
  title?: ReactNode;

  description?: ReactNode;

  children?: ReactNode;

  className?: string;
}

export function FeaturedPrograms({
  title,
  description,
  children,
  className,
}: FeaturedProgramsProps) {
  return (
    <section className={className}>
      <Stack gap={48}>
        {/* Header */}
        <Stack
          gap={16}
          align="center"
          className="
    
    text-center
  "
        >
          <Stack gap={16} align="center" className="max-w-2xl">
            {title}

            {description}
          </Stack>
        </Stack>
        {/* Cards */}
        <Grid
          className="
            grid-cols-1
            md:grid-cols-2
           
            gap-8
          "
        >
          {children}
        </Grid>
      </Stack>
    </section>
  );
}
