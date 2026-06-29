import { Inline } from "@/components/shared/primitives";

interface ProfileInfoRowProps {
  label: string;
  value: string;
}

export function ProfileInfoRow({ label, value }: ProfileInfoRowProps) {
  return (
    <Inline gap={8} align="center">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </Inline>
  );
}
