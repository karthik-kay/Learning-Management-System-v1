"use client";

import { ReactNode } from "react";

export default function IDELayout({ children }: { children: ReactNode }) {
  return <div className="h-screen w-screen overflow-hidden">{children}</div>;
}
