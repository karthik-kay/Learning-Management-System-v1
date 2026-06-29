"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const COLORS = ["#f97316", "#22c55e", "#e5e7eb"];

interface ProgressData {
  label: string;
  value: number;
}

interface Props {
  completed: number;
  inProgress: number;
  notStarted: number;
}

export function LearningDonut({ completed, inProgress, notStarted }: Props) {
  const data: ProgressData[] = [
    { label: "In Progress", value: inProgress },
    { label: "Completed", value: completed },
    { label: "Not Started", value: notStarted },
  ];

  const total = completed + inProgress + notStarted;
  const percent = Math.round((completed / total) * 100);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h3 className="font-semibold text-gray-900 mb-4">Overall Progress</h3>

      <div className="h-56 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={70}
              outerRadius={90}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold">{percent}%</span>
          <span className="text-xs text-gray-500">Complete</span>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 space-y-2 text-sm">
        <Legend color="#f97316" label="In Progress" value={inProgress} />
        <Legend color="#22c55e" label="Completed" value={completed} />
        <Legend color="#e5e7eb" label="Not Started" value={notStarted} />
      </div>
    </div>
  );
}

function Legend({
  color,
  label,
  value,
}: {
  color: string;
  label: string;
  value: number;
}) {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <span
          className="w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: color }}
        />
        <span className="text-gray-600">{label}</span>
      </div>
      <span className="font-medium">{value} courses</span>
    </div>
  );
}
