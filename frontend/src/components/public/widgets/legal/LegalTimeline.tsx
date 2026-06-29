import { Stack } from "@/components/shared/primitives";

export interface LegalTimelineItem {
  label: string;
  text: string;
}

interface LegalTimelineProps {
  items: LegalTimelineItem[];
}

export function LegalTimeline({ items }: LegalTimelineProps) {
  return (
    <Stack gap={0} className="mx-auto max-w-2xl">
      {items.map((item, index) => (
        <div key={item.label} className="grid grid-cols-[24px_1fr] gap-4">
          <div className="flex flex-col items-center">
            <span className="mt-1 size-3 rounded-full bg-[#FF7A0E]" />
            {index < items.length - 1 && (
              <span className="mt-2 h-full min-h-12 border-l border-dashed border-[#FF7A0E]/40" />
            )}
          </div>
          <div className="pb-8">
            <p className="text-sm font-bold text-[#0F172A]">{item.label}</p>
            <p className="mt-1 text-sm leading-6 text-[#6B7280]">
              {item.text}
            </p>
          </div>
        </div>
      ))}
    </Stack>
  );
}
