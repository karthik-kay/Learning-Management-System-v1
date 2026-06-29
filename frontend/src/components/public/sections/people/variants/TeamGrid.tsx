import { ReactNode } from "react";

import { PeopleCard } from "@/components/public/widgets/cards/PeopleCard";
import { Grid } from "@/components/shared/primitives";

interface TeamMember {
  image?: ReactNode;
  name: string;
  jobTitle: string;
  jobDescription: string;
  actions?: ReactNode;
}

interface TeamGridProps {
  members: TeamMember[];
  className?: string;
}

export function TeamGrid({ members, className }: TeamGridProps) {
  return (
    <Grid
      className={`
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-3
        ${className ?? ""}
      `}
      gap={32}
    >
      {members.map((member) => (
        <PeopleCard
          key={member.name}
          image={member.image}
          name={member.name}
          jobTitle={member.jobTitle}
          jobDescription={member.jobDescription}
          actions={member.actions}
        />
      ))}
    </Grid>
  );
}
