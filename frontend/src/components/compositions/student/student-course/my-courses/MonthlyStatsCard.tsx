interface Props {
  learningHours: number;
  modulesCompleted: number;
  assessmentsPassed: number;
}

export function MonthlyStatsCard({
  learningHours,
  modulesCompleted,
  assessmentsPassed,
}: Props) {
  return (
    <div className="rounded-xl bg-orange-500 text-white p-6">
      <h3 className="font-semibold mb-4">This Month</h3>

      <StatRow label="Learning Hours" value={`${learningHours}h`} />
      <StatRow label="Modules Completed" value={modulesCompleted} />
      <StatRow label="Assessments Passed" value={assessmentsPassed} />
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-1">
        <span className="opacity-90">{label}</span>
        <span className="font-semibold">{value}</span>
      </div>
      <div className="h-1 bg-white/30 rounded">
        <div className="h-full bg-white rounded w-[70%]" />
      </div>
    </div>
  );
}
