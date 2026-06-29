"use client";

import { ReactNode } from "react";

import { Box, Inline, Container } from "@/components/shared/primitives";
import { usePathname } from "next/navigation";
import { HeaderBanner } from "./widgets";

interface NavbarProps {
  media?: ReactNode;

  links?: ReactNode;

  actions?: ReactNode;

  mobileDrawer?: ReactNode;

  className?: string;
  minimal?: boolean;
}

export function Navbar({
  media,
  links,
  actions,
  mobileDrawer,
  className,
  // minimal=false,
}: NavbarProps) {
  const pathname = usePathname();

  const isHome = pathname === "/";

  return (
    <header className={`sticky top-0 z-50 w-full ${className}`}>
      {isHome && <HeaderBanner />}

      <Container>
        <Inline
          align="center"
          justify="between"
          gap={32}
          className="h-16 border "
        >
          {/* Logo */}
          <Box>{media}</Box>

          {/* Desktop Navigation */}
          <Box grow className="hidden lg:block">
            <Inline justify="center" gap={32}>
              {links}
            </Inline>
          </Box>

          {/* Desktop Actions */}
          <Box className="hidden lg:block">
            <Inline gap={16}>{actions}</Inline>
          </Box>

          {/* Mobile Menu */}
          <Box className="lg:hidden">{mobileDrawer}</Box>
        </Inline>
      </Container>
    </header>
  );
}
