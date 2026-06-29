import { cn } from "@/lib/utils";

export interface FeatureCardProps {
  title: string;
  description: string;
  ctaLabel?: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}

export function FeatureCard({
  title,
  description,
  ctaLabel,
  active = false,
  onClick,
  className,
  titleClassName,
  descriptionClassName,
}: FeatureCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "group flex min-h-[220px] w-full flex-col items-start justify-between rounded-2xl border bg-[#111111] p-6 text-left shadow-sm transition-all duration-200",
        "border-transparent hover:-translate-y-1 hover:border-[#FF7A0E] hover:shadow-xl",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7A0E] focus-visible:ring-offset-2",
        active && "border-[#FF7A0E] shadow-xl ring-1 ring-[#FF7A0E]",
        className,
      )}
    >
      <span className="space-y-4">
        <span
          className={`block text-2xl font-bold leading-tight text-white ${titleClassName}`}
        >
          {title}
        </span>
        <span
          className={`block max-w-[13rem] text-sm leading-relaxed text-[#9CA3AF] ${descriptionClassName}`}
        >
          {description}
        </span>
      </span>

      {ctaLabel && (
        <span className="mt-8 inline-flex min-h-10 items-center rounded-lg bg-white px-4 text-xs font-bold text-[#111111] transition-colors group-hover:bg-[#FF7A0E] group-hover:text-white">
          {ctaLabel}
        </span>
      )}
    </button>
  );
}
