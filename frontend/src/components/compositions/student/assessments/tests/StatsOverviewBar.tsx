// components/assessments/StatsOverviewBar.tsx
import { Zap, CheckCircle, Trophy, BarChart3 } from "lucide-react";
import { MetricCard } from "../../../../blocks/assessments/MetricCard";

export const StatsOverviewBar = () => {
  const stats = [
    {
      label: "Total XP",
      value: "1,700",
      unit: "xp",
      icon: Zap,
      variant: "primary" as const,
      trend: "+240",
    },
    {
      label: "Tests Done",
      value: "84",
      icon: CheckCircle,
      trend: "+4",
    },
    {
      label: "Badges",
      value: "12",
      icon: Trophy,
    },
    {
      label: "Avg. Score",
      value: "88",
      unit: "%",
      icon: BarChart3,
      trend: "+2%",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {stats.map((stat, idx) => (
        <MetricCard key={idx} {...stat} />
      ))}
    </div>
  );
};
