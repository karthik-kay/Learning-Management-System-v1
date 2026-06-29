import { ReactNode } from "react";
import { Box, Inline, Stack } from "@/components/shared/primitives";
import { Navbar } from "@/components/public/nav/Navbar";
import { Footer } from "@/components/public/nav/Footer";

interface LegalLayoutProps {
  children: ReactNode; // document body — main content
  toc?: ReactNode; // table of contents — sticky right sidebar, desktop only
  className?: string;
}

// Used by: /privacy, /terms, /refund-policy, /cookie-policy
// Narrow readable content width (720px max)
// Optional sticky TOC sidebar on the right — auto-generated from headings
export function LegalLayout({ children, toc, className }: LegalLayoutProps) {
  return (
    <Stack justify="start" className={`min-h-screen ${className ?? ""}`}>
      <Navbar />
      <Box grow>
        <Box
          className={`max-w-7xl mx-auto w-full px-6 py-12 ${className ?? ""}`}
        >
          <Inline
            align="start"
            justify="start"
            gap={48}
            className="
        flex-col
        xl:flex-row
    "
          >
            {/* document body */}
            <Box
              grow
              shrink
              className="
        min-w-0
        max-w-full
        xl:max-w-[720px]
    "
            >
              {children}
            </Box>

            {/* sticky TOC — desktop only */}
            {toc && (
              <Box
                shrink
                className="hidden xl:block"
                style={{ width: "220px", flexShrink: 0 }}
              >
                <Box className="sticky top-24">{toc}</Box>
              </Box>
            )}
          </Inline>
        </Box>
      </Box>
      <Footer />
    </Stack>
  );
}
