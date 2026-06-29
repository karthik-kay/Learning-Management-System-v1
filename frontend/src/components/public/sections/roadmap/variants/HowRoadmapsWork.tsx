import { BadgeCheck, Blocks, BriefcaseBusiness, Route } from "lucide-react";

import { Container } from "@/components/shared/primitives";

const steps = [
  {
    icon: Route,
    title: "Choose a domain",
    text: "Start with a broad area like web development, AI, data, DevOps, or cybersecurity.",
  },
  {
    icon: Blocks,
    title: "Explore the gears",
    text: "See the tracks inside that domain: frontend, backend, deployment, databases, testing, and more.",
  },
  {
    icon: BadgeCheck,
    title: "Build proof",
    text: "Each stage points to practical skills, tools, projects, and portfolio artifacts.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Connect careers",
    text: "Jump from the roadmap into career paths to compare roles, salaries, demand, and hiring signals.",
  },
];

export function HowRoadmapsWork() {
  return (
    <section className="bg-white py-20">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[360px_1fr] lg:items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#38A3A5]">
              How it works
            </p>
            <h2 className="mt-3 text-3xl font-black leading-tight text-[#0F172A] md:text-4xl">
              Roadmaps explain the skill route, not just the job title.
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#6B7280]">
              Career paths tell learners what roles exist. Roadmaps show how to
              become capable inside a domain, with tracks, tools, milestones,
              and proof of work.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {steps.map((step, index) => (
              <article
                key={step.title}
                className="rounded-2xl border border-[#E9EAF0] bg-[#F9FAFB] p-6"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-[#0F172A] text-white">
                    <step.icon className="size-5" />
                  </div>
                  <span className="text-3xl font-black text-[#E9EAF0]">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-black text-[#0F172A]">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#6B7280]">
                  {step.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
