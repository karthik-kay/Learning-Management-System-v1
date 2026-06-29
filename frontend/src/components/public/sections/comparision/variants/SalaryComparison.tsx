import { Box, Grid, Inline, Stack } from "@/components/shared/primitives";

export interface SalaryComparisonBar {
  role: string;
  value: string;
  width: string;
  color: string;
}

export interface SalaryStageCard {
  label: string;
  range: string;
  value: string;
  note: string;
}

interface SalaryComparisonProps {
  bars: SalaryComparisonBar[];
  cards: SalaryStageCard[];
  footnote?: string;
}

export function SalaryComparison({
  bars,
  cards,
  footnote,
}: SalaryComparisonProps) {
  return (
    <Grid className="grid-cols-1 gap-12 lg:grid-cols-[1fr_420px]">
      <Stack gap={30}>
        <Stack gap={18}>
          {bars.map((item) => (
            <Stack key={item.role} gap={8}>
              <Inline>
                <span className="text-sm text-slate-300">{item.role}</span>
                <span className="text-sm font-semibold text-white">
                  {item.value}
                </span>
              </Inline>
              <Box className="h-3 overflow-hidden rounded-md bg-[#1E293B]">
                <Box
                  className={`h-full rounded-md ${item.color}`}
                  style={{ width: item.width }}
                />
              </Box>
            </Stack>
          ))}
        </Stack>

        {footnote && <p className="text-xs italic text-slate-500">{footnote}</p>}
      </Stack>

      <Stack gap={16}>
        {cards.map((card) => (
          <Stack
            key={card.label}
            gap={10}
            className="rounded-xl border border-[#38A3A5]/25 bg-[#1E293B]/55 p-6"
          >
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
              {card.label} ({card.range})
            </p>
            <p className="text-4xl font-bold tracking-tight">{card.value}</p>
            <p className="text-sm leading-relaxed text-slate-400">
              {card.note}
            </p>
          </Stack>
        ))}
      </Stack>
    </Grid>
  );
}
