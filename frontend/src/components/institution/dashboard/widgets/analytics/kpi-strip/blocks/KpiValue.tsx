import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function KpiValue({ children }: Props) {
  return (
    <p
      className="
        text-4xl
        font-bold
      "
    >
      {children}
    </p>
  );
}
