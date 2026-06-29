import { Star } from "lucide-react";

interface Props {
  label: string;
  value: string;
  icon?: "star";
}

export function MiniStatCard({ label, value, icon }: Props) {
  return (
    <div className="bg-gray-50 rounded-lg p-3 flex flex-col items-center text-xs">
      <span className="text-gray-500">{label}</span>
      <div className="flex items-center gap-1 font-semibold text-gray-900">
        {icon === "star" && (
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
        )}
        {value}
      </div>
    </div>
  );
}
