import Image from "next/image";

import { PeopleCard } from "@/components/public/widgets/cards/PeopleCard";
import { Box, Grid, Stack } from "@/components/shared/primitives";
import { Button } from "@/components/ui/button";

export interface Lead {
  name: string;
  jobTitle: string;
  jobDescription: string;
  image?: string;
}

export interface ContactLeadsSectionProps {
  leads?: Lead[];
}
export function ContactLeadsSection({ leads = [] }: ContactLeadsSectionProps) {
  return (
    <Stack gap={32}>
      <Stack gap={8}>
        <h2 className="text-2xl font-bold">Meet Our Leads</h2>

        <p className="text-muted-foreground">
          Connect directly with the people who can help with admissions,
          partnerships, mentoring, and support.
        </p>
      </Stack>

      <Grid className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {leads.map((lead) => (
          <PeopleCard
            key={lead.name}
            name={lead.name}
            image={
              lead.image ? (
                <Box className="relative h-80 w-full">
                  {" "}
                  <Image
                    src={lead.image}
                    alt={lead.name ?? ""}
                    fill
                    className="object-cover"
                  />
                </Box>
              ) : undefined
            }
            jobTitle={lead.jobTitle}
            jobDescription={lead.jobDescription}
          />
        ))}
      </Grid>

      <div className="flex justify-center">
        <Button variant="outline">View Full Team</Button>
      </div>
    </Stack>
  );
}
