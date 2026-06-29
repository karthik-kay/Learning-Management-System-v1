// components/assessments/MetricCard.tsx
import React from "react";

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  isHighlighted?: boolean;
}

export const MetricCard = ({
  label,
  value,
  unit,
  isHighlighted,
}: MetricCardProps) => {
  return (
    <div
      className={`
      relative overflow-hidden rounded-2xl p-6 transition-all duration-300
      ${
        isHighlighted
          ? "bg-linear-to-br from-orange-400 to-orange-500 text-white shadow-orange-200 shadow-lg"
          : "bg-white border border-gray-100 text-slate-800 shadow-sm hover:shadow-md"
      }
    `}
    >
      {/* The Decorative Circle from your image */}
      <div
        className={`
        absolute -right-6 -bottom-6 w-28 h-28 rounded-full opacity-10
        ${isHighlighted ? "bg-white" : "bg-blue-600"}
      `}
      />

      <div className="relative z-10">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold tracking-tight">{value}</span>
          {unit && (
            <span className="text-lg font-medium opacity-90">{unit}</span>
          )}
        </div>
        <p
          className={`text-sm mt-1 font-medium ${
            isHighlighted ? "text-orange-50" : "text-slate-400"
          }`}
        >
          {label}
        </p>
      </div>
    </div>
  );
};
