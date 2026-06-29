import { Grid, Stack } from "@/components/shared/primitives";

export interface LegalSummaryItem {
  value: string;
  label: string;
}

interface LegalSummaryStripProps {
  items: LegalSummaryItem[];
}

export function LegalSummaryStrip({ items }: LegalSummaryStripProps) {
  return (
    <div className="border-y border-[#FFE0C0] bg-[#FFF7F0] py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Grid className="grid-cols-2 gap-6 lg:grid-cols-4">
          {items.map((item) => (
            <Stack key={item.label} gap={4}>
              <span className="font-mono text-2xl font-bold tracking-tight text-[#E86C0D]">
                {item.value}
              </span>
              <span className="text-sm font-medium leading-5 text-[#6B7280]">
                {item.label}
              </span>
            </Stack>
          ))}
        </Grid>
      </div>
    </div>
  );
}
