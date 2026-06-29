import { ReactNode } from "react";

interface LegalCalloutProps {
  title?: string;
  children: ReactNode;
  tone?: "neutral" | "orange" | "teal";
}

const toneClass = {
  neutral: "border-slate-200 bg-slate-50 text-slate-700",
  orange: "border-orange-200 bg-orange-50 text-orange-900",
  teal: "border-teal-200 bg-teal-50 text-teal-900",
};

export function LegalCallout({
  title,
  children,
  tone = "neutral",
}: LegalCalloutProps) {
  return (
    <div className={`rounded-lg border p-5 ${toneClass[tone]}`}>
      {title && <p className="mb-2 text-sm font-bold">{title}</p>}
      <div className="text-sm leading-7">{children}</div>
    </div>
  );
}
