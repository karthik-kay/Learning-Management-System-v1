import { ReactNode } from "react";
import { Grid } from "@/components/shared/primitives";

interface SidebarProps {
  sidebar: ReactNode;
  children: ReactNode;
  width?: number;
  gap?: number;
}

export function Sidebar({
  sidebar,
  children,
  width = 280,
  gap = 24,
}: SidebarProps) {
  return (
    <Grid columns={`${width}px 1fr`} gap={gap}>
      {sidebar}
      {children}
    </Grid>
  );
}
