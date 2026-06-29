import { BadgeCheck, BriefcaseBusiness, ListChecks } from "lucide-react";

import { Container } from "@/components/shared/primitives";

const items = [
  {
    icon: ListChecks,
    title: "Structured learning",
    text: "Every roadmap breaks a large career goal into focused phases, skills, and projects.",
  },
  {
    icon: BadgeCheck,
    title: "Industry-aligned",
    text: "Tracks are shaped around current tools, hiring expectations, and portfolio signals.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Placement ready",
    text: "The end goal is clarity: what to learn, what to build, and which roles to target.",
  },
];

export function WhyRoadmapsSection() {
  return (
    <section className="bg-white py-14">
      <Container>
        <div className="grid gap-4 md:grid-cols-3">
          {items.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-[#E9EAF0] bg-[#F9FAFB] p-6"
            >
              <div className="flex size-11 items-center justify-center rounded-2xl bg-[#0F172A] text-white">
                <item.icon className="size-5" />
              </div>
              <h2 className="mt-5 text-xl font-black text-[#0F172A]">
                {item.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#6B7280]">
                {item.text}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
