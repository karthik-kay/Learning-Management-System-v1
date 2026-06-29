import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function KpiLabel({ children }: Props) {
  return (
    <p
      className="
        text-sm
        text-muted-foreground
      "
    >
      {children}
    </p>
  );
}
