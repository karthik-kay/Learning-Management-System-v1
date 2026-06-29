import { PublicRoadmapDetailData } from "../roadmapData";

interface SalaryInsightsSectionProps {
  roadmap: PublicRoadmapDetailData;
}

const levels = [
  { label: "Entry", amount: "6L+", width: "42%" },
  { label: "Mid", amount: "14L+", width: "68%" },
  { label: "Senior", amount: "28L+", width: "92%" },
];

export function SalaryInsightsSection({ roadmap }: SalaryInsightsSectionProps) {
  return (
    <section className="py-20">
      <div className="rounded-3xl bg-[#0F172A] p-7 text-white md:p-10">
        <div className="grid gap-8 lg:grid-cols-[340px_1fr] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#57CC99]">
              Salary insights
            </p>
            <h2 className="mt-3 text-3xl font-black md:text-4xl">
              Clean range, realistic progression.
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#E9EAF0]">
              Use this as a planning signal. Actual offers depend on projects,
              interviews, location, and company stage.
            </p>
          </div>

          <div className="space-y-5">
            {levels.map((level) => (
              <div key={level.label}>
                <div className="mb-2 flex items-center justify-between text-sm font-bold">
                  <span>{level.label}</span>
                  <span className="text-[#FF7A0E]">
                    {level.label === "Mid" ? roadmap.salaryRange : level.amount}
                  </span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#FF7A0E] to-[#57CC99]"
                    style={{ width: level.width }}
                  />
                </div>
              </div>
            ))}

            <div className="grid gap-3 pt-3 md:grid-cols-3">
              {["Bengaluru", "Hyderabad", "Remote"].map((city) => (
                <div
                  key={city}
                  className="rounded-2xl border border-white/10 bg-white/[0.06] p-4"
                >
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#8C94A3]">
                    {city}
                  </p>
                  <p className="mt-1 text-lg font-black text-white">
                    {roadmap.salaryRange}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
