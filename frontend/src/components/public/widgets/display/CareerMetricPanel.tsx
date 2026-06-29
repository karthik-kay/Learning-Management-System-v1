import { Stack } from "@/components/shared/primitives";

interface CareerMetricPanelProps {
  label: string;
  value: string;
  caption: string;
  className?: string;
}

export function CareerMetricPanel({
  label,
  value,
  caption,
  className,
}: CareerMetricPanelProps) {
  return (
    <Stack
      gap={8}
      className={`w-56 rounded-xl border bg-[#1E293B]/80 p-5 shadow-[0_24px_70px_rgba(0,0,0,0.22)] backdrop-blur ${className ?? ""}`}
    >
      <span className="text-sm text-slate-400">{label}</span>
      <span className="text-3xl font-bold tracking-tight text-white">
        {value}
      </span>
      <span className="text-sm font-semibold text-[#57CC99]">{caption}</span>
    </Stack>
  );
}
