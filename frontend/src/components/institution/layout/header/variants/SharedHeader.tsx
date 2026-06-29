// components/institution/layout/header/variants/SharedHeader.tsx
"use client";

import { Inline } from "@/components/shared/primitives/index";

export function SharedHeader() {
  return (
    <header className="sticky top-0 z-10 w-full border-b border-slate-200 bg-white/80 px-6 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <Inline align="center" justify="end" className="h-14">
        {/* Later: Add Notifications Bell, Search Bar, and User Profile Dropdown here */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col text-right">
            <span className="text-sm font-medium leading-none">Admin User</span>
            <span className="text-xs text-slate-500">Institution Admin</span>
          </div>
          <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-800" />
        </div>
      </Inline>
    </header>
  );
}
