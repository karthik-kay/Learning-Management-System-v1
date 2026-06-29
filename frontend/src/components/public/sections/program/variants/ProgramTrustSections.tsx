import {
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  Code2,
  Quote,
  ShieldCheck,
} from "lucide-react";

const outcomes = [
  {
    title: "Portfolio-ready projects",
    text: "Graduate with deployable projects, clean READMEs, and technical stories you can explain in interviews.",
    icon: Code2,
  },
  {
    title: "Interview readiness",
    text: "Practice DSA, system design, resume walkthroughs, and mock interviews with structured feedback.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Career clarity",
    text: "Choose a track, understand the roles it maps to, and build toward a visible hiring outcome.",
    icon: BadgeCheck,
  },
];

const companies = [
  "Google India",
  "Zoho",
  "Freshworks",
  "Razorpay",
  "PhonePe",
  "Flipkart",
  "Swiggy",
  "Meesho",
];

const experts = [
  {
    title: "Industry engineers",
    text: "Program structure shaped by engineers who understand production workflows, code review, and hiring loops.",
  },
  {
    title: "Career mentors",
    text: "Career preparation designed around resume signals, interview performance, and role-fit clarity.",
  },
  {
    title: "Project reviewers",
    text: "Review cycles focus on correctness, architecture, polish, and the ability to explain tradeoffs.",
  },
];

const stories = [
  {
    name: "Aarav S.",
    role: "Full Stack Engineer",
    quote:
      "The biggest difference was building projects I could actually defend in interviews, not just list on a resume.",
  },
  {
    name: "Meera K.",
    role: "Data Analyst",
    quote:
      "The track structure helped me stop jumping between tutorials and focus on a clear hiring path.",
  },
  {
    name: "Rohan P.",
    role: "Backend Developer",
    quote:
      "Weekly reviews made my API project stronger and gave me better answers for technical interviews.",
  },
];

export function ProgramOutcomesSection() {
  return (
    <section className="bg-[#F9FAFB] py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Outcomes"
          title="What learners walk away with"
          description="The programs are built around proof: projects, interview readiness, and a clear path into the roles learners want."
        />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {outcomes.map((outcome) => (
            <article key={outcome.title} className="border border-[#E9EAF0] bg-white p-6">
              <outcome.icon className="size-5 text-[#38A3A5]" />
              <h3 className="mt-4 text-xl font-semibold text-[#0F172A]">
                {outcome.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#6B7280]">
                {outcome.text}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProgramHiringCompaniesSection() {
  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Hiring signals"
          title="Companies learners can prepare for"
          description="These names represent the kinds of hiring bars and role expectations the programs prepare learners to approach."
        />
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {companies.map((company) => (
            <div
              key={company}
              className="flex items-center gap-3 border border-[#E9EAF0] bg-[#F9FAFB] p-4"
            >
              <Building2 className="size-5 text-[#E86C0D]" />
              <span className="font-medium text-[#0F172A]">{company}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProgramExpertsSection() {
  return (
    <section className="bg-[#0F172A] py-16 text-white lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <div>
            <p className="text-sm font-medium text-[#57CC99]">
              Built by experts
            </p>
            <h2 className="mt-3 text-3xl font-semibold">
              Designed by people who know what hiring expects.
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#E9EAF0]">
              The curriculum is shaped around practical engineering, project
              review, and career readiness, not just topic coverage.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {experts.map((expert) => (
              <article
                key={expert.title}
                className="border border-white/10 bg-white/[0.05] p-5"
              >
                <ShieldCheck className="size-5 text-[#FF7A0E]" />
                <h3 className="mt-4 font-semibold text-white">{expert.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#C8CDD8]">
                  {expert.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function ProgramSuccessStoriesSection() {
  return (
    <section className="bg-[#F9FAFB] py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Success stories"
          title="Learners turning structure into outcomes"
          description="Short stories from learners who used projects, mentor feedback, and interview preparation to move with more confidence."
        />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {stories.map((story) => (
            <article key={story.name} className="border border-[#E9EAF0] bg-white p-6">
              <Quote className="size-5 text-[#38A3A5]" />
              <p className="mt-4 text-sm leading-7 text-[#374151]">
                {story.quote}
              </p>
              <div className="mt-5 border-t border-[#E9EAF0] pt-4">
                <p className="font-semibold text-[#0F172A]">{story.name}</p>
                <p className="text-sm text-[#6B7280]">{story.role}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-sm font-medium text-[#38A3A5]">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-semibold text-[#0F172A]">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-[#6B7280]">{description}</p>
    </div>
  );
}
