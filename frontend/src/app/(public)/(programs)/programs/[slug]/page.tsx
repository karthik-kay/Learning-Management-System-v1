import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BriefcaseBusiness,
  ChevronDown,
  CirclePlay,
  Clock3,
  FolderOpen,
  PlayCircle,
  Trophy,
  Users,
} from "lucide-react";

import { MarketingLayout } from "@/components/public/layouts/MarketingLayout";
import { Container } from "@/components/shared/primitives";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const programs = [
  {
    slug: "industry-ready-software-engineer",
    tags: ["Undergraduate", "Beginner friendly", "24 months", "Placement support"],
    title: "Industry-Ready Software Engineer",
    overview:
      "A comprehensive foundation designed to run alongside your degree. Master programming, DSA, web development, system design, cloud, AI integration, and placement preparation with real-world projects.",
    price: "INR 3,499/mo",
    emi: "EMI options available",
    duration: "24 months",
    mode: "Online live",
    batchSize: "30 students",
    placement: "Placement support",
    mentor: "Ananya Kumar",
    mentorMeta: "Mentor · Ex-Google · 8 yrs",
    outcomes: [
      "Build and deploy full-stack applications from scratch",
      "Master Python, DSA, databases, APIs, system design, and cloud basics",
      "Complete portfolio-grade capstone projects with mentor reviews",
      "Prepare for product, service, and startup hiring loops",
    ],
    skills: ["Python", "DSA", "React", "Node.js", "Django", "PostgreSQL", "Docker", "AWS"],
    prerequisite: "Basic computer literacy. No prior coding required.",
    careers: [
      { label: "Full Stack Engineer", href: "/career-path/full-stack-development" },
      { label: "Backend Developer", href: "/career-path/backend-architect" },
      { label: "Cloud Engineer", href: "/career-path/devops-engineer" },
    ],
    curriculum: [
      ["01", "Programming + Basics", "Python, Git, problem solving", "Weeks 1-12"],
      ["02", "DSA Foundation", "Arrays, recursion, sorting, search", "Weeks 13-24"],
      ["03", "Advanced DSA + CS Core", "Trees, graphs, OS, DBMS", "Weeks 25-36"],
      ["04", "Web Development", "Frontend, backend, APIs", "Weeks 37-52"],
      ["05", "Specialization Track", "Full stack or data science / ML", "Weeks 53-68"],
      ["06", "System Design + Projects", "Architecture, capstones, reviews", "Weeks 69-80"],
      ["07", "DevOps + Cloud", "Docker, CI/CD, cloud deploys", "Weeks 81-88"],
      ["08", "AI Integration", "LLMs, RAG, AI-enhanced products", "Weeks 89-96"],
      ["09", "Placement Preparation", "Resume, mocks, applications", "Weeks 99-106"],
    ],
    tracks: [
      ["Track A", "Full Stack Advanced", "React, APIs, databases, deployment"],
      ["Track B", "Data Science / ML", "Python, ML models, dashboards"],
      ["Track C", "Cloud + DevOps", "Docker, CI/CD, AWS, monitoring"],
    ],
    projects: [
      ["LMS module", ["React", "Django"]],
      ["AI study assistant", ["LLM", "RAG"]],
      ["Cloud deployed API", ["Docker", "AWS"]],
    ],
  },
  {
    slug: "fast-track-tech-career-program",
    tags: ["Graduate", "Fast-track", "6 months", "Placement focused"],
    title: "Fast-Track Tech Career Program",
    overview:
      "An intensive scratch-to-hero program for final-year students and graduates. Build coding foundations, DSA fluency, one specialization track, AI-integrated projects, and job readiness in 25 weeks.",
    price: "INR 4,999/mo",
    emi: "EMI options available",
    duration: "25 weeks",
    mode: "Online live",
    batchSize: "30 students",
    placement: "Placement support",
    mentor: "Rahul Menon",
    mentorMeta: "Mentor · Staff Engineer · 9 yrs",
    outcomes: [
      "Build a role-specific AI-integrated portfolio project",
      "Strengthen Python, DSA, CS fundamentals, and interview readiness",
      "Choose one specialized track based on career interest",
      "Complete resume, mock interviews, and job application cycles",
    ],
    skills: ["Python", "DSA", "SQL", "React", "FastAPI", "Docker", "RAG", "System Design"],
    prerequisite: "No advanced experience required. Basic learning commitment expected.",
    careers: [
      { label: "AI Engineer", href: "/career-path/ai-and-machine-learning" },
      { label: "Data Analyst", href: "/career-path/data-scientist" },
      { label: "DevOps Engineer", href: "/career-path/devops-engineer" },
    ],
    curriculum: [
      ["01", "Coding Foundation + AI Basics", "Python, tools, AI-assisted workflows", "Weeks 1-4"],
      ["02", "DSA + Core Fundamentals", "Problem solving, CS basics, ML intro", "Weeks 5-8"],
      ["03", "Specialization Track + AI", "One chosen track with AI integration", "Weeks 9-20"],
      ["04", "Job Readiness + Placement", "Aptitude, resume, mocks, applications", "Weeks 21-25"],
    ],
    tracks: [
      ["Track A", "Full Stack + AI", "React, APIs, AI features, deploys"],
      ["Track B", "Data Science & ML", "ML models, notebooks, FastAPI"],
      ["Track C", "Cloud & DevOps + AI", "Pipelines, cloud, automation"],
    ],
    projects: [
      ["AI portfolio app", ["LLM", "RAG"]],
      ["Analytics dashboard", ["SQL", "Tableau"]],
      ["Track capstone", ["Docker", "API"]],
    ],
  },
];

const leaderboard = [
  ["#1", "Rahul S.", "9840 pts"],
  ["#2", "Priya M.", "9410 pts"],
  ["#3", "Arjun K.", "9200 pts"],
];

const stories = [
  ["Meera K.", "Data Analyst", "The curriculum gave me a clear weekly path instead of random tutorials."],
  ["Aarav S.", "Full Stack Engineer", "The capstone reviews made my project interview-ready."],
  ["Rohan P.", "Backend Developer", "Mock interviews helped me explain my architecture decisions clearly."],
];

const reviews = [
  ["Curriculum", "4.8/5"],
  ["Mentorship", "4.9/5"],
  ["Project reviews", "4.7/5"],
];

type ProgramDetail = (typeof programs)[number];

export default async function ProgramDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const program = programs.find((item) => item.slug === slug);

  if (!program) notFound();

  return (
    <MarketingLayout className="bg-[#F9FAFB] text-[#0F172A]">
      <main>
        <ProgramOverviewHero program={program} />
        <Container>
          <div className="grid gap-8 py-8 md:py-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
            <div className="space-y-6">
              <section className="hidden">
                <div className="flex flex-wrap gap-2">
                  {program.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-[#E9EAF0] bg-[#F9FAFB] px-3 py-1 text-xs font-medium text-[#22577A]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <p className="mt-5 text-sm font-medium text-[#6B7280]">
                  Program title
                </p>
                <h1 className="mt-2 text-4xl font-semibold leading-tight md:text-5xl">
                  {program.title}
                </h1>

                <div className="mt-6 border border-[#E9EAF0] bg-[#F9FAFB] p-5">
                  <p className="text-sm font-medium text-[#6B7280]">
                    Program overview
                  </p>
                  <p className="mt-3 text-base leading-7 text-[#374151]">
                    {program.overview}
                  </p>
                  <div className="mt-5 grid min-h-[160px] place-items-center rounded-2xl border border-[#E9EAF0] bg-[#0F172A] text-[#E9EAF0]">
                    <span className="inline-flex items-center gap-2">
                      <CirclePlay className="size-8 text-[#FF7A0E]" />
                      Demo video — 3 min
                    </span>
                  </div>
                  <div className="mt-5 flex items-center gap-3">
                    <span className="grid size-10 place-items-center rounded-full bg-[#FFEEE8] text-sm font-medium text-[#E86C0D]">
                      AK
                    </span>
                    <div>
                      <p className="font-medium">{program.mentor}</p>
                      <p className="text-sm text-[#6B7280]">{program.mentorMeta}</p>
                    </div>
                  </div>
                </div>
              </section>

              <AnchorNav />
              <Outcomes outcomes={program.outcomes} />
              <Careers careers={program.careers} />
              <Skills skills={program.skills} prerequisite={program.prerequisite} />
              <Curriculum curriculum={program.curriculum} />
              <Tracks tracks={program.tracks} />
              <CertificationPlacement />
              <Leaderboard />
              <Projects projects={program.projects} />
              <SuccessStories />
              <Reviews />
              <FAQ />
            </div>

            <aside className="hidden">
              <p className="text-center text-sm font-medium text-[#6B7280]">
                Price
              </p>
              <p className="mt-2 text-center text-4xl font-semibold">
                {program.price}
              </p>
              <p className="mt-1 text-center text-sm text-[#6B7280]">
                {program.emi}
              </p>
              <dl className="mt-6 space-y-3 text-sm">
                {[
                  ["Duration", program.duration],
                  ["Mode", program.mode],
                  ["Batch size", program.batchSize],
                  ["Placement", program.placement],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-4">
                    <dt className="text-[#6B7280]">{label}</dt>
                    <dd className="font-medium text-[#0F172A]">{value}</dd>
                  </div>
                ))}
              </dl>
              <Button asChild className="mt-6 w-full bg-[#0F172A] text-white">
                <Link href="/contact">
                  Enroll now
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <p className="mt-3 text-center text-xs text-[#6B7280]">
                7-day money back · No questions asked
              </p>
            </aside>

            <ProgramStickySidebar program={program} />
          </div>
        </Container>
      </main>
    </MarketingLayout>
  );
}

function ProgramOverviewHero({ program }: { program: ProgramDetail }) {
  const initials = program.mentor
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

  return (
    <section className="bg-[#0F172A] py-8 text-white md:py-12">
      <Container>
        <Button
          asChild
          variant="ghost"
          className="mb-6 text-[#E9EAF0] hover:bg-white/10 hover:text-white"
        >
          <Link href="/programs">
            <ArrowLeft className="size-4" />
            Back to programs
          </Link>
        </Button>

        <div className="grid gap-8">
          <div className="max-w-4xl">
            <div className="flex flex-wrap gap-2">
              {program.tags.map((tag, index) => (
                <span
                  key={tag}
                  className={
                    index === 0
                      ? "rounded-full bg-[#38A3A5]/15 px-3 py-1 text-sm font-medium text-[#57CC99]"
                      : "rounded-full border border-white/15 bg-white/5 px-3 py-1 text-sm text-[#E9EAF0]"
                  }
                >
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
              {program.title}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#E9EAF0]">
              {program.overview}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-5 text-sm text-[#E9EAF0]">
              <span className="inline-flex items-center gap-2">
                <Trophy className="size-4 text-[#FEBC38]" />
                4.8 program rating
              </span>
              <span className="inline-flex items-center gap-2">
                <Users className="size-4 text-[#57CC99]" />
                2,500+ learners guided
              </span>
              <span className="inline-flex items-center gap-2">
                <Clock3 className="size-4 text-[#FF7A0E]" />
                Updated June 2026
              </span>
            </div>

            <div className="mt-8 flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-full bg-[#FFEEE8] text-sm font-semibold text-[#E86C0D]">
                {initials}
              </span>
              <div>
                <p className="font-medium text-white">Created by {program.mentor}</p>
                <p className="text-sm text-[#E9EAF0]">{program.mentorMeta}</p>
              </div>
            </div>
          </div>

          <aside className="hidden">
            <div className="relative grid min-h-[220px] place-items-center overflow-hidden bg-[#1E293B] text-white">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(56,163,165,0.45),transparent_32%),radial-gradient(circle_at_85%_15%,rgba(255,122,14,0.35),transparent_30%),linear-gradient(135deg,#0F172A,#1E293B)]" />
              <div className="relative grid place-items-center text-center">
                <span className="grid size-16 place-items-center rounded-full bg-white text-[#FF7A0E] shadow-xl">
                  <CirclePlay className="size-8 fill-[#FF7A0E]/10" />
                </span>
                <p className="mt-4 font-medium">Preview this program</p>
              </div>
            </div>

            <div className="p-6">
              <p className="text-sm text-[#6B7280]">Starting at</p>
              <p className="mt-1 text-4xl font-semibold">{program.price}</p>
              <p className="mt-1 text-sm text-[#6B7280]">{program.emi}</p>

              <dl className="mt-6 space-y-3 border-y border-[#E9EAF0] py-5 text-sm">
                {[
                  ["Duration", program.duration],
                  ["Mode", program.mode],
                  ["Batch size", program.batchSize],
                  ["Placement", program.placement],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-4">
                    <dt className="text-[#6B7280]">{label}</dt>
                    <dd className="font-medium text-[#0F172A]">{value}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-5 rounded-2xl bg-[#E7F5F4] p-4 text-sm text-[#22577A]">
                Structured mentor support, projects, and placement readiness are included with the program.
              </div>

              <Button asChild className="mt-5 w-full bg-[#FF7A0E] text-white hover:bg-[#E86C0D]">
                <Link href="/contact">
                  Enroll now
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <p className="mt-3 text-center text-xs text-[#6B7280]">
                7-day money back - no questions asked
              </p>
            </div>
          </aside>
        </div>
      </Container>
    </section>
  );
}

function ProgramStickySidebar({ program }: { program: ProgramDetail }) {
  return (
    <aside className="hidden lg:sticky lg:top-24 lg:block">
      <div className="overflow-hidden rounded-3xl border border-[#E9EAF0] bg-white text-[#0F172A] shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
        <div className="relative grid min-h-[190px] place-items-center overflow-hidden bg-[#1E293B] text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(56,163,165,0.42),transparent_34%),radial-gradient(circle_at_82%_10%,rgba(255,122,14,0.32),transparent_34%),linear-gradient(135deg,#0F172A,#1E293B)]" />
          <div className="relative grid place-items-center text-center">
            <span className="grid size-14 place-items-center rounded-full bg-white text-[#FF7A0E] shadow-xl">
              <CirclePlay className="size-7 fill-[#FF7A0E]/10" />
            </span>
            <p className="mt-3 text-sm font-medium">Preview this program</p>
          </div>
        </div>

        <div className="p-6">
          <p className="text-sm text-[#6B7280]">Starting at</p>
          <p className="mt-1 text-3xl font-semibold">{program.price}</p>
          <p className="mt-1 text-sm text-[#6B7280]">{program.emi}</p>

          <dl className="mt-5 space-y-3 border-y border-[#E9EAF0] py-5 text-sm">
            {[
              ["Duration", program.duration],
              ["Mode", program.mode],
              ["Batch size", program.batchSize],
              ["Placement", program.placement],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between gap-4">
                <dt className="text-[#6B7280]">{label}</dt>
                <dd className="font-medium text-[#0F172A]">{value}</dd>
              </div>
            ))}
          </dl>

          <Button asChild className="mt-5 w-full bg-[#FF7A0E] text-white hover:bg-[#E86C0D]">
            <Link href="/contact">
              Enroll now
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="mt-3 w-full">
            <Link href="#reviews">See learner reviews</Link>
          </Button>
          <p className="mt-3 text-center text-xs text-[#6B7280]">
            7-day money back - no questions asked
          </p>
        </div>
      </div>
    </aside>
  );
}

function AnchorNav() {
  const anchors = ["outcomes", "careers", "skills", "curriculum", "tracks", "certification", "projects", "reviews", "faq"];
  return (
    <section className="rounded-3xl border border-[#E9EAF0] bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.035)]">
      <p className="text-base font-semibold text-[#0F172A]">Jump to section</p>
      <div className="mt-4 flex flex-wrap gap-2.5">
        {anchors.map((anchor) => (
          <a
            key={anchor}
            href={`#${anchor}`}
            className="rounded-full border border-[#E9EAF0] bg-[#F9FAFB] px-4 py-2 text-sm font-medium capitalize text-[#22577A] transition hover:border-[#38A3A5]/50 hover:bg-[#E7F5F4]"
          >
            {anchor}
          </a>
        ))}
      </div>
    </section>
  );
}

function SectionShell({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-24 border-b border-[#E9EAF0] py-8 last:border-b-0"
    >
      <h2 className="text-2xl font-semibold tracking-tight text-[#0F172A]">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Outcomes({ outcomes }: { outcomes: string[] }) {
  return (
    <SectionShell id="outcomes" title="Learning outcomes">
      <ul className="space-y-2">
        {outcomes.map((outcome) => (
          <li key={outcome} className="flex gap-2 text-sm text-[#374151]">
            <span className="mt-2 size-1.5 rounded-full bg-[#FF7A0E]" />
            {outcome}
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}

function Careers({
  careers,
}: {
  careers: { label: string; href: string }[];
}) {
  const careerMeta = [
    ["Role-ready", "8L-28L range", "Portfolio + interview prep"],
    ["System track", "Backend + API depth", "Architecture reviews"],
    ["Cloud track", "Deployments + CI/CD", "Ops-ready projects"],
  ];

  return (
    <SectionShell id="careers" title="Career paths this program supports">
      <div className="grid gap-3">
        {careers.map((career, index) => (
          <Link
            key={career.label}
            href={career.href}
            className="group grid gap-4 rounded-3xl border border-[#E9EAF0] bg-white p-4 shadow-[0_14px_38px_rgba(15,23,42,0.035)] transition hover:-translate-y-0.5 hover:border-[#38A3A5]/60 hover:shadow-[0_22px_55px_rgba(15,23,42,0.075)] md:grid-cols-[52px_1fr_auto] md:items-center"
          >
            <span className="grid size-12 place-items-center rounded-2xl bg-[#E7F5F4] text-[#22577A]">
              <BriefcaseBusiness className="size-5" />
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-semibold text-[#0F172A]">{career.label}</h3>
                <span className="rounded-full bg-[#FFEEE8] px-2.5 py-1 text-xs font-medium text-[#E86C0D]">
                  {careerMeta[index]?.[0] ?? "Career path"}
                </span>
              </div>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6B7280]">
                See the role expectations, required skills, salary movement, and roadmap links connected to this program.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {(careerMeta[index] ?? ["Role-ready", "Career outcomes", "Guided roadmap"]).slice(1).map((item) => (
                  <span key={item} className="rounded-full bg-[#F9FAFB] px-3 py-1 text-xs font-medium text-[#22577A]">
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <span className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0F172A] px-4 py-2 text-sm font-medium text-white transition group-hover:bg-[#22577A]">
              View career
              <ArrowRight className="size-4" />
            </span>
          </Link>
        ))}
      </div>
    </SectionShell>
  );
}

function Skills({
  skills,
  prerequisite,
}: {
  skills: string[];
  prerequisite: string;
}) {
  const requirements = [
    ["No coding pressure", prerequisite],
    ["Laptop or PC", "Work from anywhere with a stable internet connection."],
    ["Weekly consistency", "Keep time for live sessions, practice, reviews, and projects."],
  ];

  return (
    <SectionShell id="skills" title="Skills + requirements">
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span
            key={skill}
            className="rounded-full border border-[#E9EAF0] bg-white px-3 py-1.5 text-sm font-medium text-[#22577A]"
          >
            {skill}
          </span>
        ))}
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        {requirements.map(([title, text]) => (
          <article key={title} className="rounded-2xl border border-[#E9EAF0] bg-white p-4">
            <div className="grid size-9 place-items-center rounded-xl bg-[#E7F5F4] text-[#22577A]">
              <Award className="size-4" />
            </div>
            <h3 className="mt-3 text-sm font-semibold text-[#0F172A]">{title}</h3>
            <p className="mt-1 text-sm leading-6 text-[#6B7280]">{text}</p>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}

function Curriculum({ curriculum }: { curriculum: string[][] }) {
  return (
    <SectionShell id="curriculum" title="Curriculum + timeline">
      <div className="mb-5 flex flex-wrap items-center gap-4 text-sm text-[#6B7280]">
        <span className="inline-flex items-center gap-2">
          <FolderOpen className="size-4 text-[#FF7A0E]" />
          {curriculum.length} sections
        </span>
        <span className="inline-flex items-center gap-2">
          <PlayCircle className="size-4 text-[#38A3A5]" />
          Project-led modules
        </span>
        <span className="inline-flex items-center gap-2">
          <Clock3 className="size-4 text-[#FF7A0E]" />
          Weekly milestones
        </span>
      </div>

      <Accordion type="multiple" defaultValue={[curriculum[0]?.[0] ?? "01"]}>
        {curriculum.map(([number, title, desc, weeks]) => (
          <AccordionItem
            key={number}
            value={number}
            className="mb-3 rounded-2xl border border-[#E9EAF0] bg-[#F9FAFB] px-4"
          >
            <AccordionTrigger className="gap-4 py-4 text-left hover:no-underline">
              <div className="grid flex-1 gap-3 md:grid-cols-[44px_1fr_140px] md:items-center">
                <span className="font-semibold text-[#E86C0D]">{number}</span>
                <div>
                  <p className="font-medium text-[#0F172A]">{title}</p>
                  <p className="text-sm text-[#6B7280]">{desc}</p>
                </div>
                <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-medium text-[#22577A]">
                  <Clock3 className="size-3.5" />
                  {weeks}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-5">
              <div className="grid gap-3 border-t border-[#E9EAF0] pt-4 md:grid-cols-3">
                {["Concept lessons", "Practice tasks", "Mentor review"].map(
                  (item, index) => (
                    <div key={item} className="rounded-xl bg-white p-4">
                      <p className="text-xs font-medium text-[#8C94A3]">
                        Module {index + 1}
                      </p>
                      <p className="mt-1 text-sm font-medium text-[#0F172A]">
                        {item}
                      </p>
                    </div>
                  ),
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </SectionShell>
  );
}

function Tracks({ tracks }: { tracks: string[][] }) {
  return (
    <SectionShell id="tracks" title="Specialization tracks">
      <div className="grid gap-3 md:grid-cols-3">
        {tracks.map(([tag, title, desc]) => (
          <article key={title} className="rounded-2xl border border-[#E9EAF0] bg-[#F9FAFB] p-4">
            <span className="rounded-md bg-[#FFEEE8] px-2 py-1 text-xs font-medium text-[#E86C0D]">
              {tag}
            </span>
            <h3 className="mt-3 font-medium">{title}</h3>
            <p className="mt-1 text-sm text-[#6B7280]">{desc}</p>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}

function CertificationPlacement() {
  return (
    <SectionShell id="certification" title="Certification + placement proof">
      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-3xl border border-[#E9EAF0] bg-white p-6 shadow-[0_14px_40px_rgba(15,23,42,0.035)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-[#FFEEE8] px-3 py-1 text-sm font-medium text-[#E86C0D]">
                <Award className="size-4" />
                Verified certificate
              </span>
              <h3 className="mt-4 text-xl font-semibold text-[#0F172A]">
                Shareable completion credential
              </h3>
            </div>
            <div className="grid size-14 place-items-center rounded-2xl bg-[#F9FAFB] text-[#FF7A0E]">
              <Award className="size-7" />
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-[#6B7280]">
            Issued after completing required lessons, projects, assessments, and mentor reviews. Built to support LinkedIn, resume, and portfolio proof.
          </p>
          <div className="mt-5 grid gap-2 text-sm">
            {["Unique certificate ID", "Project evaluation recorded", "LinkedIn-shareable format"].map((item) => (
              <span key={item} className="rounded-xl bg-[#F9FAFB] px-3 py-2 text-[#22577A]">
                {item}
              </span>
            ))}
          </div>
        </article>

        <article className="rounded-3xl border border-[#E9EAF0] bg-white p-6 shadow-[0_14px_40px_rgba(15,23,42,0.035)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-[#E7F5F4] px-3 py-1 text-sm font-medium text-[#22577A]">
                <BriefcaseBusiness className="size-4" />
                Placement support
              </span>
              <h3 className="mt-4 text-xl font-semibold text-[#0F172A]">
                Interview and hiring readiness
              </h3>
            </div>
            <div className="grid size-14 place-items-center rounded-2xl bg-[#F9FAFB] text-[#38A3A5]">
              <BriefcaseBusiness className="size-7" />
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-[#6B7280]">
            Resume review, mock interviews, application tracking, project presentation prep, and role-specific career path guidance.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {[
              ["Mocks", "Weekly"],
              ["Portfolio", "Reviewed"],
              ["Career", "Guided"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl bg-[#F9FAFB] p-3">
                <p className="text-xs text-[#6B7280]">{label}</p>
                <p className="mt-1 font-semibold text-[#0F172A]">{value}</p>
              </div>
            ))}
          </div>
        </article>
      </div>

      <div className="mt-4 rounded-3xl border border-[#E9EAF0] bg-[#0F172A] p-5 text-white">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-[#57CC99]">Learner review checkpoint</p>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#E9EAF0]">
              Each certificate is backed by mentor-reviewed work, project evidence, and visible progression across the curriculum.
            </p>
          </div>
          <Button asChild variant="secondary" className="w-fit bg-white text-[#0F172A] hover:bg-[#E9EAF0]">
            <Link href="#reviews">
              Read reviews
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </SectionShell>
  );
}

function Leaderboard() {
  return (
    <SectionShell id="leaderboard" title="Leaderboard">
      <div className="divide-y divide-[#E9EAF0]">
        {leaderboard.map(([rank, name, points]) => (
          <div key={rank} className="grid grid-cols-[50px_1fr_auto] py-3 text-sm">
            <span className="font-semibold text-[#E86C0D]">{rank}</span>
            <span className="font-medium">{name}</span>
            <span className="text-[#6B7280]">{points}</span>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

function Projects({ projects }: { projects: string[][] }) {
  return (
    <SectionShell id="projects" title="Capstone projects">
      <div className="grid gap-4 md:grid-cols-3">
        {projects.map(([title, tags], index) => {
          const tech = tags as unknown as string[];
          return (
            <article
              key={title}
              className="overflow-hidden rounded-3xl border border-[#E9EAF0] bg-white shadow-[0_16px_45px_rgba(15,23,42,0.04)]"
            >
              <div
                className={
                  index % 2 === 0
                    ? "h-36 bg-[radial-gradient(circle_at_24%_22%,rgba(56,163,165,0.45),transparent_34%),linear-gradient(135deg,#0F172A,#22577A)]"
                    : "h-36 bg-[radial-gradient(circle_at_75%_18%,rgba(255,122,14,0.42),transparent_34%),linear-gradient(135deg,#1E293B,#0F172A)]"
                }
              >
                <div className="flex h-full items-end p-4">
                  <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-[#22577A]">
                    Portfolio build
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-[#0F172A]">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#6B7280]">
                  Ship a production-style project with reviews, deployment notes, and a walkthrough-ready case study.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {tech.map((tag) => (
                    <span key={tag} className="rounded-full bg-[#F9FAFB] px-2.5 py-1 text-xs font-medium text-[#22577A]">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </SectionShell>
  );
}

function SuccessStories() {
  return (
    <SectionShell id="success" title="Success stories">
      <div className="grid gap-3 md:grid-cols-3">
        {stories.map(([name, role, quote]) => (
          <article key={name} className="rounded-2xl border border-[#E9EAF0] bg-[#F9FAFB] p-4">
            <Users className="size-5 text-[#38A3A5]" />
            <p className="mt-3 text-sm leading-6 text-[#374151]">{quote}</p>
            <p className="mt-4 font-medium">{name}</p>
            <p className="text-sm text-[#6B7280]">{role}</p>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}

function Reviews() {
  const distribution = [
    ["5 star", "78%"],
    ["4 star", "17%"],
    ["3 star", "4%"],
    ["2 star", "1%"],
  ];

  return (
    <SectionShell id="reviews" title="Reviews">
      <div className="grid gap-5 rounded-3xl border border-[#E9EAF0] bg-white p-5 md:grid-cols-[220px_1fr]">
        <div className="grid place-items-center rounded-2xl bg-[#F9FAFB] p-6 text-center">
          <p className="text-5xl font-semibold text-[#0F172A]">4.8</p>
          <div className="mt-2 flex justify-center gap-1 text-[#FF7A0E]">
            {Array.from({ length: 5 }).map((_, index) => (
              <Trophy key={index} className="size-4 fill-[#FF7A0E]/20" />
            ))}
          </div>
          <p className="mt-2 text-sm text-[#6B7280]">Learner rating</p>
          <Button asChild variant="outline" className="mt-4">
            <Link href="/success-stories">View review stories</Link>
          </Button>
        </div>

        <div className="space-y-5">
          <div className="grid gap-3 md:grid-cols-3">
            {reviews.map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-[#E9EAF0] bg-[#F9FAFB] p-4">
                <p className="text-2xl font-semibold text-[#0F172A]">{value}</p>
                <p className="mt-1 text-sm text-[#6B7280]">{label}</p>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            {distribution.map(([label, value]) => (
              <div key={label} className="grid grid-cols-[64px_1fr_42px] items-center gap-3 text-sm">
                <span className="text-[#6B7280]">{label}</span>
                <span className="h-2 overflow-hidden rounded-full bg-[#E9EAF0]">
                  <span className="block h-full rounded-full bg-[#FF7A0E]" style={{ width: value }} />
                </span>
                <span className="text-right font-medium text-[#0F172A]">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionShell>
  );
}

function FAQ() {
  const faqs = [
    ["Do I need prior experience?", "No. We start from fundamentals and build up with projects."],
    ["What is the time commitment?", "Undergrad is lighter weekly. Fast-track requires a more intensive schedule."],
    ["Is the certificate recognised?", "It is shareable and backed by completed project and assessment proof."],
  ];

  return (
    <SectionShell id="faq" title="FAQ">
      <div className="divide-y divide-[#E9EAF0]">
        {faqs.map(([q, a]) => (
          <details key={q} className="py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
              {q}
              <ChevronDown className="size-4" />
            </summary>
            <p className="mt-2 text-sm text-[#6B7280]">{a}</p>
          </details>
        ))}
      </div>
    </SectionShell>
  );
}
