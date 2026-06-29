import { Stack } from "@/components/shared/primitives";

import { CenterHeroProps } from "../types";

export function CenterHero({
  badge,
  title,
  description,
  actions,
  stats,
  className,
}: CenterHeroProps) {
  return (
    <Stack
      align="center"
      gap={24}
      className={`
          max-w-4xl
         
          mx-auto
          text-center
          ${className}
        `}
    >
      {badge}

      {title}

      {description && <div className="max-w-2xl">{description}</div>}

      {actions && (
        <div className="flex flex-wrap justify-center gap-4">{actions}</div>
      )}

      {stats}
    </Stack>
  );
}
