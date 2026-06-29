"use client";

import { useState, useEffect } from "react";
import { djangoService } from "@/services/djangoService";
import { BarChart3, TrendingUp, Loader2 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function DailyBarChart() {
  const [data, setData] = useState<{ day: string; hours: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    djangoService
      .getDailyLearningHours()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  const totalHours = data.reduce((sum, item) => sum + item.hours, 0);
  const avgHours = data.length ? (totalHours / data.length).toFixed(1) : "0";

  return (
    <section className="daily-chart">
      <header className="daily-chart__header">
        <div className="daily-chart__title">
          <BarChart3 />
          <div>
            <h3>Daily Learning Hours</h3>
            <p>Past 7 days overview</p>
          </div>
        </div>

        {!loading && (
          <div className="daily-chart__trend">
            <TrendingUp />
            <span>+12.5%</span>
          </div>
        )}
      </header>

      {!loading && (
        <div className="daily-chart__stats">
          <div>
            <strong>{totalHours}h</strong>
            <span>Total this week</span>
          </div>
          <div>
            <strong>{avgHours}h</strong>
            <span>Daily avg</span>
          </div>
        </div>
      )}

      <div className="daily-chart__body">
        {loading ? (
          <div className="daily-chart__loading">
            <Loader2 />
            <span>Loading chart...</span>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="hours"
                barSize={26}
                radius={[6, 6, 0, 0]}
                fill="var(--chart-bar)"
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
}
