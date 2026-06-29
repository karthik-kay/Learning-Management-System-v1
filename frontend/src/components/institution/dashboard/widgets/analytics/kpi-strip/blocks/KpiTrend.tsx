import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function KpiTrend({ children }: Props) {
  return (
    <p
      className="
        text-xs
        text-muted-foreground
      "
    >
      {children}
    </p>
  );
}
