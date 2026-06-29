"use client";

import { usePathname } from "next/navigation";

export function useBreadcrumb(rootLabel = "Main") {
  const pathname = usePathname();

  const segments = pathname.split("/").filter(Boolean);
  const crumbs = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");

    const label = segment
      .replace(/-/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());

    return { label, href };
  });

  return [{ label: rootLabel, href: "/" + segments[0] }, ...crumbs.slice(1)];
}
