"use client";

import { TrendingUp, Target } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Line,
} from "recharts";

export default function MonthlyLineChart() {
  const weeklyData = [
    { week: "Week 1", value: 20, target: 25 },
    { week: "Week 2", value: 45, target: 25 },
    { week: "Week 3", value: 30, target: 25 },
    { week: "Week 4", value: 60, target: 25 },
  ];

  const totalValue = weeklyData.reduce((sum, item) => sum + item.value, 0);
  const avgValue = (totalValue / weeklyData.length).toFixed(1);

  return (
    <section className="monthly-chart">
      {/* Header */}
      <header className="monthly-chart__header">
        <div className="monthly-chart__title">
          <TrendingUp />
          <div>
            <h3>Monthly Progress</h3>
            <p>Weekly learning overview</p>
          </div>
        </div>

        <div className="monthly-chart__status">
          <Target />
          <span>Above target</span>
        </div>
      </header>

      {/* Stats row */}
      <div className="monthly-chart__stats">
        <div>
          <strong>{totalValue}h</strong>
          <span>This month</span>
        </div>

        <div>
          <strong>{avgValue}h</strong>
          <span>Weekly avg</span>
        </div>

        <div>
          <strong>240%</strong>
          <span>vs target</span>
        </div>
      </div>

      {/* Chart */}
      <div className="monthly-chart__body">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />

            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip />

            <Line
              type="monotone"
              dataKey="target"
              stroke="var(--chart-target)"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />

            <defs>
              <linearGradient id="monthlyArea" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--chart-primary)"
                  stopOpacity={0.25}
                />
                <stop
                  offset="100%"
                  stopColor="var(--chart-primary)"
                  stopOpacity={0.05}
                />
              </linearGradient>
            </defs>

            <Area
              type="monotone"
              dataKey="value"
              stroke="var(--chart-primary)"
              strokeWidth={3}
              fill="url(#monthlyArea)"
              dot={{
                r: 5,
                fill: "var(--chart-primary)",
                strokeWidth: 2,
                stroke: "var(--chart-surface)",
              }}
              activeDot={{
                r: 7,
                fill: "var(--chart-primary)",
                strokeWidth: 2,
                stroke: "var(--chart-surface)",
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
