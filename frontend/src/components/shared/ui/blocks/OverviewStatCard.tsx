import { Card, CardContent } from "@/components/ui/card";

export interface OverviewStatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  hint?: string;
}

export function OverviewStatCard({
  label,
  value,
  icon,
  hint,
}: OverviewStatCardProps) {
  return (
    <Card className="rounded-xl border">
      <CardContent className="flex items-center justify-between p-4">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold">{value}</p>

          {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        </div>

        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardContent>
    </Card>
  );
}
