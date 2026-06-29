import { Stack } from "@/components/shared/primitives";
import { ReactNode } from "react";

interface LegalArticleSectionProps {
  id: string;
  number: number;
  title: string;
  children: ReactNode;
  accent?: "slate" | "teal" | "orange";
}

const accentClass = {
  slate: "text-slate-900",
  teal: "text-teal-700",
  orange: "text-orange-600",
};

export function LegalArticleSection({
  id,
  number,
  title,
  children,
  accent = "slate",
}: LegalArticleSectionProps) {
  return (
    <section id={id} className="scroll-mt-28">
      <Stack gap={16}>
        <h2
          className={`text-xl font-bold tracking-tight ${accentClass[accent]}`}
        >
          {number}. {title}
        </h2>
        <div className="space-y-4 text-sm leading-7 text-slate-600">
          {children}
        </div>
      </Stack>
    </section>
  );
}
