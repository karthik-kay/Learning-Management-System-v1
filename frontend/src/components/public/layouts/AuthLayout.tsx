import { ReactNode } from "react";
import { Box, Inline } from "@/components/shared/primitives";

interface AuthLayoutProps {
  children: ReactNode; // the auth form — right side
  panel?: ReactNode; // brand panel content — left side, desktop only
  className?: string;
}

// Used by: /login, /register, /forgot-password, /password-reset, /verify-email
// No navbar. No footer. Full screen.
// Left: brand panel dark bg (desktop only, hidden mobile)
// Right: centred auth form, white bg
export function AuthLayout({ children, panel, className }: AuthLayoutProps) {
  return (
    <Box
      className={`min-h-screen flex flex-col lg:flex-row ${className ?? ""}`}
    >
      {/* left brand panel — desktop only */}
      {panel && (
        <Box className="hidden lg:flex lg:w-1/2 bg-[#0F172A] flex-col justify-between p-12">
          {panel}
        </Box>
      )}

      {/* right form area */}
      <Box
        grow
        className="flex items-center justify-center p-6 lg:p-12 bg-white"
      >
        <Box className="w-full max-w-[440px]">{children}</Box>
      </Box>
    </Box>
  );
}
