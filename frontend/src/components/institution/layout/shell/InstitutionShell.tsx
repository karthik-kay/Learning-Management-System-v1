// components/institution/layout/shell/InstitutionShell.tsx
import { ReactNode } from "react";
import { Inline, Stack } from "@/components/shared/primitives/index";

interface InstitutionShellProps {
  sidebar: ReactNode;
  header: ReactNode;
  children: ReactNode;
}

export function InstitutionShell({
  sidebar,
  header,
  children,
}: InstitutionShellProps) {
  return (
    <Inline
      align="stretch"
      justify="start"
      // 1. CHANGED: Locked to exactly h-screen and blocked outer scroll
      className="h-screen w-full overflow-hidden bg-slate-50 dark:bg-slate-950"
      gap={0}
    >
      {/* SIDEBAR SLOT */}
      {/* 2. ADDED: h-full so it respects the locked screen height */}
      <div className="hidden h-full sm:block">{sidebar}</div>

      {/* MAIN CONTENT SLOT */}
      <Stack
        grow
        justify="start"
        gap={0}
        // 3. ADDED: h-full to the Stack so it takes exactly the remaining vertical space
        className="relative h-full max-w-full overflow-hidden"
      >
        {/* Header will naturally take up its exact height at the top */}
        {header}

        {/* 4. flex-1 allows this main tag to fill the remaining space below the header, 
             and overflow-y-auto gives it the independent scrollbar! */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8">{children}</main>
      </Stack>
    </Inline>
  );
}
