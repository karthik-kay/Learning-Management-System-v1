import { ReactNode } from "react";

export interface Mentor {
  id: string;

  name: string;

  role: string;

  company: string;

  image: string;
}

export interface MentorSpotlightProps {
  title?: ReactNode;

  description?: ReactNode;

  mentors: Mentor[];

  actions?: ReactNode;
  className?: string;
}
