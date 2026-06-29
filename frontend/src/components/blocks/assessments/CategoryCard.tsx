import { LucideIcon } from "lucide-react";

interface CategoryCardProps {
  title: string;
  count: number;
  icon: LucideIcon;
  color?: "indigo" | "orange" | "emerald" | "blue" | "purple";
}

export const CategoryCard = ({
  title,
  count,
  icon: Icon,
  color = "indigo",
}: CategoryCardProps) => {
  const bgMap: Record<string, string> = {
    indigo: "bg-indigo-50",
    orange: "bg-orange-50",
    emerald: "bg-emerald-50",
    blue: "bg-blue-50",
    purple: "bg-purple-50",
  };

  const iconMap: Record<string, string> = {
    indigo: "text-indigo-600",
    orange: "text-orange-600",
    emerald: "text-emerald-600",
    blue: "text-blue-600",
    purple: "text-purple-600",
  };

  return (
    <div
      className={`
        flex items-center gap-4
        px-4 py-5
        rounded-xl
        ${bgMap[color]}
        hover:brightness-[0.98]
        transition
        cursor-pointer
      `}
    >
      {/* Icon (NO BOX) */}
      <Icon size={22} className={iconMap[color]} />

      {/* Text */}
      <div>
        <p className="text-sm font-semibold text-slate-800">{title}</p>
        <p className="text-[11px] text-slate-500">
          {count.toLocaleString()} Assessments
        </p>
      </div>
    </div>
  );
};
