// logoCloud/types.ts

import { ReactNode } from "react";

export interface Company {
  id: string;
  name: string;
  logo?: string;
}

export interface PlacementCompaniesProps {
  title?: ReactNode;

  subheading?: ReactNode;

  companies: Company[];
}
