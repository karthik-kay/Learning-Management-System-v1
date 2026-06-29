// components/student/assessments/tests/CategoryCard.tsx

import {
  Terminal,
  Globe,
  Cpu,
  Database,
  Layout,
  ShieldCheck,
} from "lucide-react";
import { CategoryCard } from "../../../../blocks/assessments/CategoryCard";

export const CategorySection = () => {
  const categories = [
    {
      title: "Frontend Development",
      count: 1240,
      icon: Layout,
      color: "indigo",
    },
    { title: "Backend Systems", count: 850, icon: Database, color: "emerald" },
    { title: "Python Logic", count: 2100, icon: Terminal, color: "orange" },
    { title: "Data Science", count: 420, icon: Cpu, color: "blue" },
    { title: "Cybersecurity", count: 115, icon: ShieldCheck, color: "purple" },
    { title: "Web Basics", count: 3200, icon: Globe, color: "indigo" },
  ] as const;

  return (
    <section className="space-y-4">
      {/* Header */}
      <div className="px-1">
        <h2 className="text-lg font-semibold">Explore by Category</h2>
        <p className="text-xs text-slate-500">
          Browse assessments by subject area
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {categories.map((cat, index) => (
          <CategoryCard key={index} {...cat} />
        ))}
      </div>
    </section>
  );
};
