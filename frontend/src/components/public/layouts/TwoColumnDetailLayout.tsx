import { ReactNode } from "react";
import { Box, Container, Inline, Stack } from "@/components/shared/primitives";
import { Navbar } from "@/components/public/nav/Navbar";
import { Footer } from "@/components/public/nav/Footer";

interface TwoColumnDetailLayoutProps {
  children: ReactNode; // main content — left col
  sidebar: ReactNode; // sticky right col — enroll card, skills etc
  sidebarWidth?: string;
  className?: string;
}
export function TwoColumnDetailLayout({
  children,
  sidebar,
  className,
}: TwoColumnDetailLayoutProps) {
  return (
    <Stack justify="start" className={`min-h-screen ${className ?? ""}`}>
      <Navbar />
      <Box grow>
        <Container>
          <Inline
            align="start"
            justify="start"
            gap={32}
            className="
        flex-col
        lg:flex-row
        relative
    "
          >
            {/* main content */}
            <Box grow shrink className="min-w-0 py-8">
              {children}
            </Box>
            {/* sticky sidebar */}
            <Box
              shrink
              className="
        py-8
        w-full
        lg:w-auto
        lg:shrink-0
    "
            >
              <Box className="lg:sticky lg:top-24">{sidebar}</Box>
            </Box>
          </Inline>
        </Container>
      </Box>
      <Footer />
    </Stack>
  );
}
