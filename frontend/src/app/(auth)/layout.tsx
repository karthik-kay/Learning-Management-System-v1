"use client";

import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[linear-gradient(to_bottom,#ffffff_0%,#fff4e0_90%)]">
      {children}
    </div>
  );
}
