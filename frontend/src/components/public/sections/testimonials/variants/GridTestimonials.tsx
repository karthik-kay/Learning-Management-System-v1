// sections/testimonials/variants/GridTestimonials.tsx

import { ReactNode } from "react";

import { Box, Grid, Stack } from "@/components/shared/primitives";

interface GridTestimonialsProps {
  title?: ReactNode;

  description?: ReactNode;

  children?: ReactNode;

  actions?: ReactNode;

  className?: string;
}

export function GridTestimonials({
  title,
  description,
  children,
  actions,
  className,
}: GridTestimonialsProps) {
  return (
    <Stack gap={48} className={className}>
      {/* Header */}
      <Stack gap={16} align="center" className="text-center">
        {title}

        {description}
      </Stack>

      {/* Testimonials Grid */}
      <Grid
        className="
          grid-cols-1
          md:grid-cols-2
          lg:grid-cols-3
          gap-8
        "
      >
        {children}
      </Grid>

      {/* CTA */}
      {actions && <Box className="text-center">{actions}</Box>}
    </Stack>
  );
}
