import { Grid, Stack } from "@/components/shared/primitives";

export interface LegalProcessStep {
  title: string;
  description: string;
}

interface LegalProcessStepsProps {
  steps: LegalProcessStep[];
}

export function LegalProcessSteps({ steps }: LegalProcessStepsProps) {
  return (
    <Grid className="grid-cols-1 gap-4 md:grid-cols-3">
      {steps.map((step, index) => (
        <Stack
          key={step.title}
          gap={14}
          className="rounded-xl border border-[#E9EAF0] bg-white p-6 shadow-[0_18px_54px_rgba(15,23,42,0.04)]"
        >
          <span className="grid size-10 place-items-center rounded-full bg-[#FFEEE8] font-mono text-sm font-bold text-[#E86C0D]">
            {index + 1}
          </span>
          <Stack gap={8}>
            <h3 className="text-lg font-bold text-[#0F172A]">{step.title}</h3>
            <p className="text-sm leading-6 text-[#6B7280]">
              {step.description}
            </p>
          </Stack>
        </Stack>
      ))}
    </Grid>
  );
}
