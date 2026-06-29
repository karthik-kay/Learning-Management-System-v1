import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface InstitutionStatusBadgeProps {
  status?: string | null;
}

const statusStyles: Record<string, string> = {
  active: "border-[#38A3A5]/30 bg-[#E7F6F5] text-[#22577A]",
  inactive: "border-slate-200 bg-slate-50 text-slate-600",
  suspended: "border-rose-200 bg-rose-50 text-rose-700",
  offboarded: "border-rose-200 bg-rose-50 text-rose-700",
  graduated: "border-[#FF7A0E]/25 bg-[#FFF0E8] text-[#E86C0D]",
  on_leave: "border-amber-200 bg-amber-50 text-amber-700",
};

export function InstitutionStatusBadge({ status }: InstitutionStatusBadgeProps) {
  const normalized = status ?? "N/A";

  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-full px-2.5 py-1 text-xs font-medium capitalize",
        statusStyles[normalized] ?? "border-slate-200 bg-slate-50 text-slate-600",
      )}
    >
      {normalized.replaceAll("_", " ")}
    </Badge>
  );
}
