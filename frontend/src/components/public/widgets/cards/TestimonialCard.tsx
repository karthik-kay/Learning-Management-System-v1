// widgets/cards/TestimonialCard.tsx

import { ReactNode } from "react";

import { Box, Stack, Inline } from "@/components/shared/primitives";

interface TestimonialCardProps {
  quote: ReactNode;

  image?: ReactNode;

  name: ReactNode;

  role?: ReactNode;

  company?: ReactNode;

  className?: string;
}

export function TestimonialCard({
  quote,
  image,
  name,
  role,
  company,
  className,
}: TestimonialCardProps) {
  return (
    <Box
      className={`
        rounded-3xl
        border
        bg-white
        p-8
        transition-all
        duration-200
        hover:-translate-y-1
        hover:border-orange-500
        ${className ?? ""}
      `}
    >
      <Stack gap={24}>
        {/* Quote Icon */}
        <Box
          className="
            text-4xl
            leading-none
            text-orange-500
          "
        ></Box>

        {/* Quote */}
        <Box
          className="
            text-slate-700
            leading-relaxed
          "
        >
          {quote}
        </Box>

        {/* Student */}
        <Inline align="center" gap={12}>
          {image && (
            <Box
              className="
                h-12
                w-12
                overflow-hidden
                rounded-full
                shrink-0
              "
            >
              {image}
            </Box>
          )}

          <Stack gap={4}>
            <Box>{name}</Box>

            {(role || company) && (
              <Inline
                gap={6}
                className="
                  text-sm
                  text-slate-500
                  flex-wrap
                "
              >
                {role}

                {role && company && <span>•</span>}

                {company}
              </Inline>
            )}
          </Stack>
        </Inline>
      </Stack>
    </Box>
  );
}
