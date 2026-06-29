import { ReactNode } from "react";

export interface SplitHeroProps {
  badge?: ReactNode;

  title: ReactNode;

  description?: ReactNode;

  actions?: ReactNode;

  stats?: ReactNode;

  media?: ReactNode;

  reverse?: boolean;

  className?: string;
}

export interface CenterHeroProps {
  badge?: ReactNode;

  title: ReactNode;

  description?: ReactNode;

  actions?: ReactNode;

  stats?: ReactNode;

  className?: string;
}
