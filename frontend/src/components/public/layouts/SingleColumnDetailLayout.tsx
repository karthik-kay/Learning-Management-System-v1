import { ReactNode } from "react";
import { Box, Container, Stack } from "@/components/shared/primitives";

interface SingleColumnDetailLayoutProps {
  children: ReactNode;
  maxWidth?: string; // default 860px — narrower than marketing, focused reading
  className?: string;
}

// Used by: /success-stories/[id], /events/[slug], /blog/[slug], /mentors/[slug]
// Narrower content column, centred, no sidebar
// Focused reading experience — nothing competing for attention
export function SingleColumnDetailLayout({
  children,
  className,
}: SingleColumnDetailLayoutProps) {
  return (
    <Stack justify="start" className={`min-h-screen ${className ?? ""}`}>
      <Box grow>
        <Box className=" py-8 lg:py-12">{children}</Box>
      </Box>
    </Stack>
  );
}
