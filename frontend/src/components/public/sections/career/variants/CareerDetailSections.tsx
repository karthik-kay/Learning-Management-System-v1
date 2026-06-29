import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Code2,
  FileQuestion,
  MessageSquareText,
  MonitorPlay,
  Quote,
  Star,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";

interface CareerDetailSectionProps {
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
}

export function CareerDetailSection({
  title,
  description,
  children,
  className,
}: CareerDetailSectionProps) {
  return (
    <section className={`py-14 ${className ?? ""}`}>
      <div className="mb-8 max-w-3xl">
        <p className="text-sm font-medium text-[#38A3A5]">Career path</p>
        <h2 className="mt-2 text-3xl font-semibold text-[#0F172A]">
          {title}
        </h2>
        <p className="mt-3 text-sm leading-7 text-[#6B7280]">{description}</p>
      </div>
      {children}
    </section>
  );
}

export function CareerOutcomesSection({ outcomes }: { outcomes: string[] }) {
  return (
    <CareerDetailSection
      title="Outcomes you can target"
      description="The goal is not only to learn tools, but to understand which roles those tools make possible."
    >
      <div className="grid gap-4 md:grid-cols-3">
        {outcomes.map((outcome) => (
          <article key={outcome} className="border border-[#E9EAF0] bg-white p-5">
            <BriefcaseBusiness className="size-5 text-[#E86C0D]" />
            <h3 className="mt-4 text-lg font-semibold text-[#0F172A]">
              {outcome}
            </h3>
            <p className="mt-2 text-sm leading-6 text-[#6B7280]">
              Build the project proof, vocabulary, and interview stories needed
              to apply for this role with confidence.
            </p>
          </article>
        ))}
      </div>
    </CareerDetailSection>
  );
}

export function DayInLifeSection({ title }: { title: string }) {
  const dayItems = [
    ["Morning", "Review product priorities, tasks, and technical blockers."],
    ["Build", "Write code, analyze data, debug systems, or improve models."],
    ["Review", "Discuss decisions with peers, mentors, or product teams."],
    ["Ship", "Document progress, push changes, and prepare demos or reports."],
  ];

  return (
    <CareerDetailSection
      title="A day in the life"
      description={`A practical look at how a ${title} spends time across building, review, and communication.`}
      className="border-t border-[#E9EAF0]"
    >
      <div className="grid gap-4 md:grid-cols-4">
        {dayItems.map(([label, text]) => (
          <article key={label} className="border border-[#E9EAF0] bg-white p-5">
            <CalendarDays className="size-5 text-[#38A3A5]" />
            <h3 className="mt-4 font-semibold text-[#0F172A]">{label}</h3>
            <p className="mt-2 text-sm leading-6 text-[#6B7280]">{text}</p>
          </article>
        ))}
      </div>
    </CareerDetailSection>
  );
}

export function ToolsTechStackSection({ skills }: { skills: string[] }) {
  const groups = [
    { label: "Core tools", icon: Code2, items: skills.slice(0, 4) },
    {
      label: "Workflow",
      icon: MonitorPlay,
      items: ["Git", "Projects", "Debugging", "Documentation"],
    },
    {
      label: "Collaboration",
      icon: Users,
      items: ["Code review", "Standups", "Mentor review", "Portfolio demos"],
    },
  ];

  return (
    <CareerDetailSection
      title="Tools and tech stack"
      description="The stack changes by company, but these are the practical tools and workflows learners should become comfortable with."
      className="border-t border-[#E9EAF0]"
    >
      <div className="grid gap-4 md:grid-cols-3">
        {groups.map((group) => (
          <article key={group.label} className="border border-[#E9EAF0] bg-white p-5">
            <group.icon className="size-5 text-[#E86C0D]" />
            <h3 className="mt-4 font-semibold text-[#0F172A]">{group.label}</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {group.items.map((item) => (
                <span
                  key={item}
                  className="rounded-md bg-[#F9FAFB] px-3 py-1.5 text-xs font-medium text-[#22577A]"
                >
                  {item}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </CareerDetailSection>
  );
}

export function CompaniesHiringSection() {
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

  return (
    <CareerDetailSection
      title="Companies hiring"
      description="These company names are directionally useful hiring signals for the kinds of roles this path prepares learners for."
      className="border-t border-[#E9EAF0]"
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {companies.map((company) => (
          <div
            key={company}
            className="flex items-center gap-3 border border-[#E9EAF0] bg-white p-4"
          >
            <Building2 className="size-5 text-[#38A3A5]" />
            <span className="font-medium text-[#0F172A]">{company}</span>
          </div>
        ))}
      </div>
    </CareerDetailSection>
  );
}

export function InterviewPrepSection({ outcomes }: { outcomes: string[] }) {
  const prep = [
    ["Portfolio walkthrough", "Explain project goals, tradeoffs, and what you improved."],
    ["Technical rounds", "Practice fundamentals, debugging, architecture, and role-specific tasks."],
    ["Behavioral stories", "Prepare stories for ownership, teamwork, setbacks, and learning speed."],
  ];

  return (
    <CareerDetailSection
      title="Interview prep"
      description={`Prepare for ${outcomes[0] ?? "software"} interviews with role-specific proof and clear technical storytelling.`}
      className="border-t border-[#E9EAF0]"
    >
      <div className="grid gap-4 md:grid-cols-3">
        {prep.map(([title, text]) => (
          <article key={title} className="border border-[#E9EAF0] bg-white p-5">
            <FileQuestion className="size-5 text-[#E86C0D]" />
            <h3 className="mt-4 font-semibold text-[#0F172A]">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-[#6B7280]">{text}</p>
          </article>
        ))}
      </div>
    </CareerDetailSection>
  );
}

export function SuccessStoriesSection() {
  const stories = [
    {
      name: "Aarav S.",
      role: "Frontend Engineer",
      quote:
        "The clearest shift was learning how to explain my project decisions. That made interviews much less random.",
    },
    {
      name: "Meera K.",
      role: "Data Analyst",
      quote:
        "The roadmap helped me stop collecting tutorials and start building a portfolio around business problems.",
    },
    {
      name: "Rohan P.",
      role: "Backend Developer",
      quote:
        "Mentor reviews made my API project feel production-ready instead of just another demo app.",
    },
  ];

  return (
    <CareerDetailSection
      title="Community and success stories"
      description="Learners grow faster when they can compare progress, get feedback, and see what good outcomes look like."
      className="border-t border-[#E9EAF0]"
    >
      <div className="grid gap-4 md:grid-cols-3">
        {stories.map((story) => (
          <article key={story.name} className="border border-[#E9EAF0] bg-white p-5">
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
    </CareerDetailSection>
  );
}

export function CareerRoadmapLinkSection({
  roadmapSlug,
}: {
  roadmapSlug: string;
}) {
  return (
    <CareerDetailSection
      title="Roadmap"
      description="Use the roadmap to move from career interest into an actual learning route with phases, tools, and projects."
      className="border-t border-[#E9EAF0]"
    >
      <div className="border border-[#E9EAF0] bg-white p-6 md:flex md:items-center md:justify-between">
        <div>
          <BookOpen className="size-5 text-[#38A3A5]" />
          <h3 className="mt-4 text-2xl font-semibold text-[#0F172A]">
            Follow the skill roadmap
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6B7280]">
            Open the connected roadmap to see phases, projects, tools, and
            learning milestones.
          </p>
        </div>
        <Button asChild className="mt-5 bg-[#0F172A] text-white md:mt-0">
          <Link href={`/roadmaps/${roadmapSlug}`}>
            Open roadmap
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </CareerDetailSection>
  );
}

export function CareerProgramsSection() {
  const programs = [
    {
      title: "Industry-Ready Software Engineer",
      text: "A longer structured program for undergraduates building career foundations.",
    },
    {
      title: "Fast-Track Tech Career Program",
      text: "A focused program for learners who want quicker transition and intensive project proof.",
    },
  ];

  return (
    <CareerDetailSection
      title="Programs"
      description="Choose a LearnerSlate program when you want mentorship, review cycles, and structured accountability around the career path."
      className="border-t border-[#E9EAF0]"
    >
      <div className="grid gap-4 md:grid-cols-2">
        {programs.map((program) => (
          <article key={program.title} className="border border-[#E9EAF0] bg-white p-6">
            <BadgeCheck className="size-5 text-[#57CC99]" />
            <h3 className="mt-4 text-xl font-semibold text-[#0F172A]">
              {program.title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-[#6B7280]">
              {program.text}
            </p>
            <Link
              href="/programs"
              className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[#E86C0D]"
            >
              Compare programs
              <ArrowRight className="size-4" />
            </Link>
          </article>
        ))}
      </div>
    </CareerDetailSection>
  );
}

export function CareerCTASection() {
  return (
    <section className="py-16">
      <div className="bg-[#0F172A] p-8 text-center text-white md:p-12">
        <Star className="mx-auto size-6 text-[#FF7A0E]" />
        <h2 className="mt-4 text-3xl font-semibold">
          Ready to choose your path?
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[#E9EAF0]">
          Compare roadmaps, speak with a counsellor, or start with the program
          that fits your current stage.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild className="bg-[#FF7A0E] text-white hover:bg-[#E86C0D]">
            <Link href="/programs">View programs</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
          >
            <Link href="/contact">
              Talk to a counsellor
              <MessageSquareText className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
