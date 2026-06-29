import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  BriefcaseBusiness,
  LineChart,
  Map,
} from "lucide-react";

import { MarketingLayout } from "@/components/public/layouts/MarketingLayout";
import {
  CareerCTASection,
  CareerOutcomesSection,
  CareerProgramsSection,
  CareerRoadmapLinkSection,
  CompaniesHiringSection,
  DayInLifeSection,
  InterviewPrepSection,
  SuccessStoriesSection,
  ToolsTechStackSection,
} from "@/components/public/sections/career/variants/CareerDetailSections";
import { Container } from "@/components/shared/primitives";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const careers = [
  {
    slug: "ai-and-machine-learning",
    title: "AI and Machine Learning",
    tag: "Hot",
    description:
      "Master Python, deep learning, NLP, and MLOps to build intelligent software systems.",
    salary: "INR 18.4 LPA",
    range: "INR 12L to 28L",
    roadmapSlug: "ai-ml-engineer",
    demand: "High demand across AI product teams and automation-heavy startups.",
    skills: ["Python", "TensorFlow", "NLP", "Computer Vision", "MLOps"],
    outcomes: ["ML Engineer", "AI Engineer", "Applied AI Developer"],
  },
  {
    slug: "full-stack-development",
    title: "Full Stack Development",
    tag: "Best Seller",
    description:
      "Build end-to-end applications from frontend interfaces to backend APIs and databases.",
    salary: "INR 14.2 LPA",
    range: "INR 8L to 22L",
    roadmapSlug: "full-stack-engineer",
    demand: "Consistent demand from startups, agencies, and product companies.",
    skills: ["Next.js", "Django", "PostgreSQL", "REST APIs", "AWS"],
    outcomes: ["Frontend Developer", "Backend Developer", "Full Stack Engineer"],
  },
  {
    slug: "data-scientist",
    title: "Data Scientist",
    tag: "Trending",
    description:
      "Extract insights from large datasets using statistics, machine learning, and analytics.",
    salary: "INR 16.8 LPA",
    range: "INR 9L to 25L",
    roadmapSlug: "data-science-and-ml",
    demand: "Growing roles in analytics, ML systems, risk, and growth teams.",
    skills: ["Pandas", "Scikit-learn", "SQL", "Statistics", "Tableau"],
    outcomes: ["Data Scientist", "ML Analyst", "Decision Scientist"],
  },
  {
    slug: "backend-architect",
    title: "Backend Architect",
    tag: "Advanced",
    description:
      "Design scalable APIs, distributed systems, queues, caching, and cloud-ready services.",
    salary: "INR 15.5 LPA",
    range: "INR 10L to 30L",
    roadmapSlug: "backend-architect",
    demand: "Strong demand where systems scale, reliability, and APIs matter.",
    skills: ["System Design", "Redis", "AWS", "Queues", "Databases"],
    outcomes: ["Backend Engineer", "API Engineer", "Solutions Architect"],
  },
  {
    slug: "devops-engineer",
    title: "DevOps Engineer",
    tag: "High Demand",
    description:
      "Own CI/CD, containers, observability, infrastructure automation, and cloud reliability.",
    salary: "INR 17.0 LPA",
    range: "INR 9L to 28L",
    roadmapSlug: "devops-engineer",
    demand: "High demand in cloud-native product and platform teams.",
    skills: ["Docker", "Kubernetes", "Terraform", "CI/CD", "Monitoring"],
    outcomes: ["DevOps Engineer", "Cloud Engineer", "Platform Engineer"],
  },
  {
    slug: "frontend-specialist",
    title: "Frontend Specialist",
    tag: "Creative Tech",
    description:
      "Craft polished product interfaces with React, design systems, accessibility, and performance.",
    salary: "INR 12.0 LPA",
    range: "INR 7L to 20L",
    roadmapSlug: "frontend-specialist",
    demand: "Steady demand for engineers who can make products feel excellent.",
    skills: ["React", "TypeScript", "Design Systems", "Accessibility", "Performance"],
    outcomes: ["Frontend Engineer", "UI Engineer", "Design Systems Developer"],
  },
];

export default async function CareerPathDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const career = careers.find((item) => item.slug === slug);

  if (!career) {
    notFound();
  }

  return (
    <MarketingLayout className="bg-[#F9FAFB] text-[#0F172A]">
      <section className="bg-[#0F172A] py-16 text-white">
        <Container>
          <Button
            asChild
            variant="ghost"
            className="mb-8 text-[#E9EAF0] hover:bg-white/10 hover:text-white"
          >
            <Link href="/career-path">
              <ArrowLeft className="size-4" />
              Back to career paths
            </Link>
          </Button>

          <div className="max-w-4xl">
            <Badge className="bg-[#FFEEE8] text-[#E86C0D]">
              {career.tag}
            </Badge>
            <h1 className="mt-5 text-4xl font-semibold leading-tight md:text-6xl">
              {career.title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[#E9EAF0]">
              {career.description}
            </p>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <article className="border border-[#E9EAF0] bg-white p-7">
              <p className="text-sm font-medium text-[#38A3A5]">
                Career overview
              </p>
              <h2 className="mt-3 text-3xl font-semibold">
                What this path prepares you for
              </h2>
              <p className="mt-4 text-sm leading-7 text-[#6B7280]">
                {career.demand}
              </p>

              <div className="mt-7 grid gap-3 md:grid-cols-3">
                <Stat icon={<LineChart />} label="Avg salary" value={career.salary} />
                <Stat icon={<BriefcaseBusiness />} label="Range" value={career.range} />
                <Stat icon={<Map />} label="Outcomes" value={`${career.outcomes.length}+ roles`} />
              </div>
            </article>

            <aside className="border border-[#E9EAF0] bg-white p-7">
              <p className="text-sm font-medium text-[#E86C0D]">Skills</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {career.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-md bg-[#F9FAFB] px-3 py-1.5 text-xs font-medium text-[#22577A]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </aside>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
            <article className="border border-[#E9EAF0] bg-white p-7">
              <p className="text-sm font-medium text-[#38A3A5]">
                Progression
              </p>
              <div className="relative mt-7 grid gap-5 md:grid-cols-4">
                <div className="absolute left-4 right-4 top-[18px] hidden h-px bg-[#38A3A5]/30 md:block" />
                {["Foundation", "Projects", "Interview", "Role-ready"].map(
                  (step, index) => (
                    <div key={step} className="relative">
                      <span
                        className={`relative z-10 flex size-9 items-center justify-center rounded-full text-sm font-semibold text-white ring-4 ring-white ${
                          index === 0 ? "bg-[#FF7A0E]" : "bg-[#38A3A5]"
                        }`}
                      >
                        {index + 1}
                      </span>
                      <h3 className="mt-4 font-semibold text-[#0F172A]">
                        {step}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-[#6B7280]">
                        Build the proof needed for {career.outcomes[index % career.outcomes.length]} roles.
                      </p>
                    </div>
                  ),
                )}
              </div>
            </article>
          </div>

          <CareerOutcomesSection outcomes={career.outcomes} />
          <CareerRoadmapLinkSection roadmapSlug={career.roadmapSlug} />
          <SalarySection career={career} />
          <CareerProgramsSection />
          <DayInLifeSection title={career.title} />
          <ToolsTechStackSection skills={career.skills} />
          <CompaniesHiringSection />
          <InterviewPrepSection outcomes={career.outcomes} />
          <SuccessStoriesSection />
          <CareerCTASection />
        </Container>
      </section>
    </MarketingLayout>
  );
}

function SalarySection({
  career,
}: {
  career: {
    salary: string;
    range: string;
  };
}) {
  return (
    <section className="border-t border-[#E9EAF0] py-14">
      <div className="mb-8 max-w-3xl">
        <p className="text-sm font-medium text-[#38A3A5]">Salary</p>
        <h2 className="mt-2 text-3xl font-semibold text-[#0F172A]">
          Salary insight
        </h2>
        <p className="mt-3 text-sm leading-7 text-[#6B7280]">
          A simple range view for planning. Real outcomes depend on portfolio
          quality, interview readiness, company stage, and city.
        </p>
      </div>

      <div className="border border-[#E9EAF0] bg-white p-7">
        <div className="grid gap-5 md:grid-cols-[260px_1fr] md:items-center">
          <div>
            <p className="text-sm font-medium text-[#6B7280]">Average package</p>
            <p className="mt-2 text-3xl font-semibold text-[#0F172A]">
              {career.salary}
            </p>
            <p className="mt-1 text-sm text-[#E86C0D]">{career.range}</p>
          </div>
          <div className="space-y-4">
            {[
              ["Entry", "38%"],
              ["Mid", "68%"],
              ["Senior", "90%"],
            ].map(([label, width]) => (
              <div key={label}>
                <div className="mb-2 flex justify-between text-sm font-medium text-[#0F172A]">
                  <span>{label}</span>
                  <span>{label === "Mid" ? career.salary : career.range}</span>
                </div>
                <div className="h-2 bg-[#E9EAF0]">
                  <div
                    className="h-full bg-gradient-to-r from-[#FF7A0E] to-[#38A3A5]"
                    style={{ width }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="border border-[#E9EAF0] bg-[#F9FAFB] p-4">
      <div className="text-[#38A3A5] [&_svg]:size-4">{icon}</div>
      <p className="mt-3 text-xs font-medium text-[#8C94A3]">{label}</p>
      <p className="mt-1 text-lg font-semibold text-[#0F172A]">{value}</p>
    </div>
  );
}
