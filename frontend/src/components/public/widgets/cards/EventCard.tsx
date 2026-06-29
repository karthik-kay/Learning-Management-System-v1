import { Box, Inline, Stack } from "@/components/shared/primitives";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, CalendarDays, Trophy, Users } from "lucide-react";
import Link from "next/link";

export type EventType =
  | "Webinar"
  | "Workshop"
  | "Exam"
  | "Bounty"
  | "Hackathon";

export interface EventCardData {
  id: string;
  type: EventType;
  title: string;
  date: string;
  time?: string;
  mentor?: string;
  description?: string;
  href: string;
  ctaLabel?: string;
  meta?: string;
  prize?: string;
  teamSize?: string;
  deadline?: string;
  certification?: string;
}

interface EventCardProps {
  event: EventCardData;
  compact?: boolean;
}

const typeTone: Record<EventType, string> = {
  Webinar: "border-[#38A3A5]/20 bg-[#38A3A5]/10 text-[#22577A]",
  Workshop: "border-[#FF7A0E]/20 bg-[#FFEEE8] text-[#E86C0D]",
  Exam: "border-[#22577A]/20 bg-[#22577A]/10 text-[#22577A]",
  Bounty: "border-[#57CC99]/25 bg-[#57CC99]/10 text-[#22577A]",
  Hackathon: "border-[#FEBC38]/25 bg-[#FFF7E6] text-[#E86C0D]",
};

export function EventCard({ event, compact = false }: EventCardProps) {
  return (
    <Stack
      gap={compact ? 14 : 18}
      className="rounded-xl border border-[#E9EAF0] bg-white p-5 shadow-[0_18px_54px_rgba(15,23,42,0.05)] transition hover:border-[#38A3A5]/40 hover:shadow-[0_24px_70px_rgba(34,87,122,0.1)]"
    >
      <Inline>
        <Badge className={`rounded-full ${typeTone[event.type]}`}>
          {event.type}
        </Badge>
        {event.prize && (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-[#E86C0D]">
            <Trophy className="size-3.5" />
            {event.prize}
          </span>
        )}
      </Inline>

      <Stack gap={8}>
        <h3 className="text-lg font-bold leading-tight text-[#0F172A]">
          {event.title}
        </h3>
        {event.description && !compact && (
          <p className="text-sm leading-6 text-[#6B7280]">
            {event.description}
          </p>
        )}
      </Stack>

      <Stack gap={8}>
        <span className="inline-flex items-center gap-2 text-sm font-medium text-[#6B7280]">
          <CalendarDays className="size-4 text-[#38A3A5]" />
          {event.date}
          {event.time ? `, ${event.time}` : ""}
        </span>
        {event.mentor && (
          <span className="inline-flex items-center gap-2 text-sm font-medium text-[#6B7280]">
            <Users className="size-4 text-[#38A3A5]" />
            {event.mentor}
          </span>
        )}
        {event.certification && (
          <span className="text-sm font-medium text-[#22577A]">
            Leads to: {event.certification}
          </span>
        )}
        {event.teamSize && (
          <span className="text-sm font-medium text-[#22577A]">
            Team size: {event.teamSize}
          </span>
        )}
        {event.deadline && (
          <span className="text-sm font-medium text-[#22577A]">
            Deadline: {event.deadline}
          </span>
        )}
      </Stack>

      <Box className="h-px bg-[#E9EAF0]" />

      <Button asChild size="sm" className="w-fit bg-[#0F172A] text-white hover:bg-[#1E293B]">
        <Link href={event.href}>
          {event.ctaLabel ?? "Register Now"}
          <ArrowRight className="size-4" />
        </Link>
      </Button>
    </Stack>
  );
}
