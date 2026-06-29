"use client";

import { EventCardData } from "@/components/public/widgets/cards/EventCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CalendarDays } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface EventHeroCarouselProps {
  events: EventCardData[];
}

export function EventHeroCarousel({ events }: EventHeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % events.length);
    }, 4500);

    return () => window.clearInterval(timer);
  }, [events.length]);

  const previous = () => {
    setActiveIndex((current) =>
      current === 0 ? events.length - 1 : current - 1,
    );
  };

  const next = () => {
    setActiveIndex((current) => (current + 1) % events.length);
  };

  return (
    <div className="mx-auto mt-12 w-full max-w-5xl">
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-[0_28px_80px_rgba(0,0,0,0.18)] backdrop-blur">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {events.map((event) => (
            <div key={event.id} className="min-w-full px-1">
              <div className="grid gap-5 rounded-xl bg-[#1E293B] p-5 text-left md:grid-cols-[1fr_auto] md:items-center">
                <div className="space-y-4">
                  <span className="inline-flex rounded-full bg-[#38A3A5]/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#57CC99]">
                    {event.type}
                  </span>
                  <div>
                    <h3 className="text-2xl font-bold text-white">
                      {event.title}
                    </h3>
                    <p className="mt-2 inline-flex items-center gap-2 text-sm text-[#E9EAF0]">
                      <CalendarDays className="size-4 text-[#38A3A5]" />
                      {event.date}
                      {event.time ? `, ${event.time}` : ""}
                    </p>
                  </div>
                </div>

                <Button
                  asChild
                  className="bg-[#FF7A0E] text-white hover:bg-[#E86C0D]"
                >
                  <Link href={event.href}>
                    {event.ctaLabel ?? "Register Now"}
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={previous}
          className="grid size-9 place-items-center rounded-full border border-white/15 text-white transition hover:bg-white/10"
          aria-label="Previous event"
        >
          <ArrowLeft className="size-4" />
        </button>

        <div className="flex items-center gap-2">
          {events.map((event, index) => (
            <button
              key={event.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Go to ${event.title}`}
              className={`h-2 rounded-full transition-all ${
                index === activeIndex
                  ? "w-8 bg-[#FF7A0E]"
                  : "w-2 bg-white/30 hover:bg-white/60"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={next}
          className="grid size-9 place-items-center rounded-full border border-white/15 text-white transition hover:bg-white/10"
          aria-label="Next event"
        >
          <ArrowRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
