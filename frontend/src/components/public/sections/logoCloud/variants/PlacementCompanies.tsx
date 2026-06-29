// PlacementCompanies.tsx

import { Inline, Stack } from "@/components/shared/primitives";
import { LogoChip } from "@/components/public/widgets/display/LogoChip";

import { PlacementCompaniesProps } from "../types";

export function PlacementCompanies({
  title,
  subheading,
  companies,
}: PlacementCompaniesProps) {
  return (
    <Stack gap={24} align="center" className="text-center">
      {subheading}

      {title}

      <Inline justify="center" gap={24} className="flex-wrap">
        {companies.map((company) => (
          <LogoChip key={company.id}>{company.name}</LogoChip>
        ))}
      </Inline>
    </Stack>
  );
}
