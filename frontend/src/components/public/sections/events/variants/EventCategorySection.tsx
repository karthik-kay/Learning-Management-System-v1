import { EventCard, EventCardData } from "@/components/public/widgets/cards/EventCard";
import { Grid, Inline, Stack } from "@/components/shared/primitives";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface EventCategorySectionProps {
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
  ctaLabel: string;
  ctaHref: string;
  events: EventCardData[];
  flipped?: boolean;
}

export function EventCategorySection({
  eyebrow,
  title,
  description,
  bullets,
  ctaLabel,
  ctaHref,
  events,
  flipped = false,
}: EventCategorySectionProps) {
  const info = (
    <Stack gap={24}>
      <Stack gap={12}>
        <span className="w-fit rounded-full bg-[#38A3A5]/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#22577A]">
          {eyebrow}
        </span>
        <h2 className="max-w-xl text-3xl font-bold leading-tight tracking-tight text-[#0F172A] lg:text-4xl">
          {title}
        </h2>
        <p className="max-w-xl text-base leading-relaxed text-[#6B7280]">
          {description}
        </p>
      </Stack>

      <Stack gap={12}>
        {bullets.map((bullet) => (
          <Inline key={bullet} gap={10} justify="start" align="start">
            <CheckCircle2 className="mt-0.5 size-4 text-[#38A3A5]" />
            <span className="text-sm leading-6 text-[#6B7280]">{bullet}</span>
          </Inline>
        ))}
      </Stack>

      <Button asChild className="w-fit bg-[#0F172A] text-white hover:bg-[#1E293B]">
        <Link href={ctaHref}>
          {ctaLabel}
          <ArrowRight className="size-4" />
        </Link>
      </Button>
    </Stack>
  );

  const cards = (
    <Stack gap={14}>
      {events.map((event) => (
        <EventCard key={event.id} event={event} compact />
      ))}
    </Stack>
  );

  return (
    <Grid className="grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
      {flipped ? (
        <>
          {cards}
          {info}
        </>
      ) : (
        <>
          {info}
          {cards}
        </>
      )}
    </Grid>
  );
}
