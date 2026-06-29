import { Stack } from "@/components/shared/primitives";
import { ReactNode } from "react";

interface LegalFeatureCardProps {
  icon?: ReactNode;
  title: string;
  children: ReactNode;
  dark?: boolean;
}

export function LegalFeatureCard({
  icon,
  title,
  children,
  dark = false,
}: LegalFeatureCardProps) {
  return (
    <Stack
      gap={14}
      className={
        dark
          ? "rounded-xl border border-white/10 bg-[#1E293B] p-6 text-white shadow-[0_22px_64px_rgba(15,23,42,0.16)]"
          : "rounded-xl border border-[#E9EAF0] bg-white p-6 shadow-[0_18px_54px_rgba(15,23,42,0.05)]"
      }
    >
      {icon && <span className="text-2xl">{icon}</span>}
      <h3 className={dark ? "text-xl font-bold text-white" : "text-xl font-bold text-[#0F172A]"}>
        {title}
      </h3>
      <div className={dark ? "text-sm leading-7 text-[#E9EAF0]" : "text-sm leading-7 text-[#6B7280]"}>
        {children}
      </div>
    </Stack>
  );
}
