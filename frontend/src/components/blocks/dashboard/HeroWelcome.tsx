"use client";

import { CalendarDays } from "lucide-react";
import { Inline, Stack } from "@/components/shared/primitives";

interface HeroWelcomeProps {
  name: string;
  message: string;
  className?: string;
}

export default function HeroWelcome({
  name,
  message,
  className,
}: HeroWelcomeProps) {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Inline justify="between" className={className}>
      <Stack>
        <h1>Welcome back, {name}!</h1>
        <p>{message}</p>
      </Stack>

      <Inline>
        <CalendarDays />
        <span>{today}</span>
      </Inline>
    </Inline>
  );
}
