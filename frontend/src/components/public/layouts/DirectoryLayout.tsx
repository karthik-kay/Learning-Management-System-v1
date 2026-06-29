import { ReactNode } from "react";
import { Box, Inline, Stack } from "@/components/shared/primitives";
import { Navbar } from "@/components/public/nav/Navbar";
import { Footer } from "@/components/public/nav/Footer";

interface DirectoryLayoutProps {
  children: ReactNode; // main content — search + grid + pagination
  filters: ReactNode; // left sticky filter sidebar
  filtersWidth?: string; // default 260px
  className?: string;
}

// Used by: /courses, /mentors, /certifications, /companies, /roadmaps, /search
// Left: sticky filter sidebar (hidden on mobile, drawer instead)
// Right: search bar + active filter pills + card grid + pagination

export function DirectoryLayout({
  children,
  filters,
  filtersWidth = "260px",
  className,
}: DirectoryLayoutProps) {
  return (
    <Stack justify="start" className={`min-h-screen ${className ?? ""}`}>
      <Navbar />
      <Box grow>
        <Box className="max-w-7xl mx-auto w-full px-6">
          <Inline align="start" justify="start" gap={32} className="py-8">
            {/* sticky filter sidebar — hidden on mobile */}
            <Box
              shrink
              className="hidden lg:block"
              style={{ width: filtersWidth, flexShrink: 0 }}
            >
              <Box className="sticky top-24">{filters}</Box>
            </Box>
            {/* main content */}
            <Box grow shrink className="min-w-0">
              {children}
            </Box>
          </Inline>
        </Box>
      </Box>
      <Footer />
    </Stack>
  );
}
