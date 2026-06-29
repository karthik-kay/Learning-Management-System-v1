interface RoadmapStatPillProps {
  label: string;
  value: string | number;
  tone?: "orange" | "teal" | "dark";
}

const toneClasses = {
  orange: "border-[#FF7A0E]/30 bg-[#FFEEE8] text-[#E86C0D]",
  teal: "border-[#38A3A5]/25 bg-[#38A3A5]/10 text-[#22577A]",
  dark: "border-[#0F172A]/10 bg-[#0F172A] text-white",
};

export function RoadmapStatPill({
  label,
  value,
  tone = "teal",
}: RoadmapStatPillProps) {
  return (
    <div className={`rounded-2xl border px-4 py-3 ${toneClasses[tone]}`}>
      <p className="text-xs font-bold uppercase tracking-[0.12em] opacity-70">
        {label}
      </p>
      <p className="mt-1 text-lg font-black">{value}</p>
    </div>
  );
}
