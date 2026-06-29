import { Inline, Stack } from "@/components/shared/primitives";
import { CheckCircle2, XCircle } from "lucide-react";

interface LegalChecklistPanelProps {
  title: string;
  items: string[];
  tone: "positive" | "negative";
}

export function LegalChecklistPanel({
  title,
  items,
  tone,
}: LegalChecklistPanelProps) {
  const isPositive = tone === "positive";

  return (
    <Stack
      gap={18}
      className="rounded-xl border border-[#E9EAF0] bg-white p-6 shadow-[0_18px_54px_rgba(15,23,42,0.05)]"
    >
      <h3 className="text-xl font-bold text-[#0F172A]">{title}</h3>
      <Stack gap={12}>
        {items.map((item) => (
          <Inline key={item} gap={10} align="start" justify="start">
            {isPositive ? (
              <CheckCircle2 className="mt-0.5 size-4 text-[#57CC99]" />
            ) : (
              <XCircle className="mt-0.5 size-4 text-[#FF7A0E]" />
            )}
            <span className="text-sm leading-6 text-[#6B7280]">{item}</span>
          </Inline>
        ))}
      </Stack>
    </Stack>
  );
}
