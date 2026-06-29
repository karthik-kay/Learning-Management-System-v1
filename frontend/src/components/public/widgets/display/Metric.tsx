import { Box } from "@/components/shared/primitives";

interface MetricProps {
  value: string;
  label: string;
  labelClassName?: string;
  valueClassName?: string;
}

export function Metric({
  value,
  label,
  labelClassName,
  valueClassName,
}: MetricProps) {
  return (
    <Box>
      <h2
        className={`
          text-3xl
          font-bold
          leading-none
          ${labelClassName}
        `}
      >
        {value}
      </h2>

      <p
        className={`
          mt-2
          text-sm
          text-muted-foreground
          ${valueClassName}
        `}
      >
        {label}
      </p>
    </Box>
  );
}
