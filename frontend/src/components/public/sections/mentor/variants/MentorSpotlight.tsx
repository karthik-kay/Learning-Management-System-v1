// sections/mentor/MentorSpotlight.tsx

import { Stack, Grid, Box } from "@/components/shared/primitives";

import Image from "next/image";

import { MentorCard } from "@/components/public/widgets/cards/MentorCard";
import { MentorSpotlightProps } from "../types";

export function MentorSpotlight({
  title,
  description,
  mentors,
  actions,
  className,
}: MentorSpotlightProps) {
  return (
    <Stack gap={48} className={className}>
      {/* Header */}
      <Stack gap={16} align="center" className="text-center">
        {title}

        {description}
      </Stack>

      {/* Mentors */}
      <Grid
        className="
          grid-cols-2
          lg:grid-cols-3
          gap-8
        "
      >
        {mentors.map((mentor) => (
          <MentorCard
            key={mentor.id}
            image={
              <Box className="relative h-80 w-full">
                <Image
                  src={mentor.image}
                  alt={mentor.name}
                  fill
                  className="object-cover"
                />
              </Box>
            }
            role={
              <span
                className="
                  rounded-full
                  bg-white
                  px-3
                  py-1
                  text-xs
                  font-medium
                "
              >
                {mentor.role}
              </span>
            }
            name={<h3 className="text-lg font-semibold">{mentor.name}</h3>}
            company={<p className="text-muted-foreground">{mentor.company}</p>}
          />
        ))}
      </Grid>

      {/* CTA */}
      {actions && <Stack align="center">{actions}</Stack>}
    </Stack>
  );
}
