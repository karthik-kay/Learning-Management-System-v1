import { Inline } from "@/components/shared/primitives";

interface LegalTagListProps {
  tags: string[];
  tone?: "teal" | "orange" | "slate";
}

const toneClass = {
  teal: "bg-teal-100 text-teal-700",
  orange: "bg-orange-100 text-orange-700",
  slate: "bg-slate-100 text-slate-700",
};

export function LegalTagList({ tags, tone = "teal" }: LegalTagListProps) {
  return (
    <Inline gap={10} justify="start" wrap>
      {tags.map((tag) => (
        <span
          key={tag}
          className={`rounded-md px-3 py-1.5 text-xs font-bold ${toneClass[tone]}`}
        >
          {tag}
        </span>
      ))}
    </Inline>
  );
}
