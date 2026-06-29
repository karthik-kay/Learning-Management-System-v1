import { Grid, Inline, Stack } from "@/components/shared/primitives";

interface LegalInfoGridItem {
  label: string;
  text: string;
}

interface LegalInfoGridProps {
  items: LegalInfoGridItem[];
}

export function LegalInfoGrid({ items }: LegalInfoGridProps) {
  return (
    <Grid className="grid-cols-1 gap-4 rounded-lg bg-slate-100 p-5 sm:grid-cols-2">
      {items.map((item) => (
        <Inline key={item.label} align="start" justify="start" gap={10}>
          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-orange-500" />
          <Stack gap={2}>
            <span className="text-sm font-bold text-slate-900">
              {item.label}
            </span>
            <span className="text-sm leading-relaxed text-slate-600">
              {item.text}
            </span>
          </Stack>
        </Inline>
      ))}
    </Grid>
  );
}
