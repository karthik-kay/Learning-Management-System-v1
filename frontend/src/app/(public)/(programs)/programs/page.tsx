import { MarketingLayout } from "@/components/public/layouts/MarketingLayout";
import { ComparisonSection } from "@/components/public/sections/comparision/ComparisonSection";
import { ProgramFitComparison } from "@/components/public/sections/comparision/variants/ProgramFitComparison";
import { CTASection } from "@/components/public/sections/cta/CTASection";
import CenterCTA from "@/components/public/sections/cta/variants/CenterCTA";
import { FAQSection } from "@/components/public/sections/faq/FAQSection";
import { SimpleFAQSection } from "@/components/public/sections/faq/variants/SimpleFAQ";
import { HeroSection } from "@/components/public/sections/hero/HeroSection";
import { CenterHero } from "@/components/public/sections/hero/variants/CenterHero";
import { ProgramSection } from "@/components/public/sections/program/ProgramSection";
import { ProgramShowcaseCard } from "@/components/public/sections/program/variants/ProgramShowcaseCard";
import {
  ProgramExpertsSection,
  ProgramHiringCompaniesSection,
  ProgramOutcomesSection,
  ProgramSuccessStoriesSection,
} from "@/components/public/sections/program/variants/ProgramTrustSections";
import { Box } from "@/components/shared/primitives";
import { Button } from "@/components/ui/button";
import { CalendarDays, MessageSquare } from "lucide-react";
import Link from "next/link";

const undergraduateProgram = {
  eyebrow: "Undergraduate Program",
  title: "Industry-Ready Software Engineer",
  description:
    "A comprehensive foundation designed to run alongside your degree. Master data structures, systems design, and full-stack development with real-world projects.",
  chips: ["Backend Architecture", "Data Science", "Cloud Ops"],
  stats: [
    { label: "Average CTC", value: "INR 6.5L" },
    { label: "Highest CTC", value: "INR 18L", tone: "accent" as const },
  ],
  panel: {
    duration: "24 Months",
    priceLabel: "INR 3,499/mo",
    bullets: [
      "1-on-1 mentorship from MAANG engineers",
      "Portfolio of 4 production-grade projects",
      "Interview prep and mock coding rounds",
      "Official certification on completion",
    ],
    cohortDate: "October 15, 2026",
  },
  phases: [
    { title: "Phase 1", subtitle: "Programming + basics" },
    { title: "Phase 2", subtitle: "DSA foundation" },
    { title: "Phase 3", subtitle: "Advanced DSA + CS core" },
    { title: "Phase 4", subtitle: "Web development" },
    { title: "Phase 5", subtitle: "Specialization track" },
    { title: "Phase 6", subtitle: "System design + projects" },
    { title: "Phase 7", subtitle: "DevOps + cloud" },
    { title: "Phase 8", subtitle: "AI integration" },
    { title: "Phase 9", subtitle: "Placement preparation" },
  ],
  tracks: [
    {
      label: "Backend Architecture",
      description:
        "Learn APIs, databases, authentication, queues, caching, and system design foundations.",
      roles: ["Backend Developer", "API Engineer", "Full Stack Engineer"],
      skills: ["Django", "Node.js", "PostgreSQL", "Redis"],
    },
    {
      label: "Data Science",
      description:
        "Build confidence with Python, analytics, machine learning, dashboards, and decision systems.",
      roles: ["Data Analyst", "ML Associate", "Data Scientist"],
      skills: ["Python", "Pandas", "SQL", "Scikit-learn"],
    },
    {
      label: "Cloud Ops",
      description:
        "Understand deployment, containers, CI/CD, observability, and cloud-ready engineering.",
      roles: ["Cloud Engineer", "DevOps Associate", "Platform Engineer"],
      skills: ["Docker", "AWS", "CI/CD", "Monitoring"],
    },
  ],
};

const graduateProgram = {
  eyebrow: "Graduate Program",
  title: "Fast-Track Tech Career Program",
  description:
    "Zero-to-one mastery of specialized tracks. Focus on intensive coding, problem solving, and career placement support from day one.",
  stats: [
    { label: "Average CTC", value: "INR 6.5L" },
    { label: "Placement Rate", value: "94%", tone: "accent" as const },
  ],
  quote: {
    duration: "6 Months",
    quote: "The shortest path to a high-paying job.",
    description:
      "Designed for final-year students and graduates who need to upskill rapidly with zero fluff.",
    cohortDate: "October 15, 2026",
  },
  chips: ["React Native", "SQL Mastery", "Cybersecurity", "Data Analytics"],
  panel: {
    priceLabel: "INR 4,999/mo",
    bullets: [
      "Specialized mentor-led tracks",
      "Weekly coding and system design reviews",
      "Placement support from the first month",
      "Resume, portfolio, and mock interview prep",
    ],
  },
  phases: [
    { title: "Phase 1", subtitle: "Coding foundation + AI basics" },
    { title: "Phase 2", subtitle: "DSA + core fundamentals" },
    { title: "Phase 3", subtitle: "Specialization track + AI" },
    { title: "Phase 4", subtitle: "Job readiness + placement" },
  ],
  tracks: [
    {
      label: "React Native",
      description:
        "Build production-ready mobile apps with modern React Native workflows and app-store thinking.",
      roles: ["Mobile Developer", "Frontend Engineer", "Product Engineer"],
      skills: ["React Native", "TypeScript", "APIs", "App UX"],
    },
    {
      label: "SQL Mastery",
      description:
        "Develop strong database instincts for analytics, backend systems, reporting, and interviews.",
      roles: ["Data Analyst", "Backend Developer", "BI Associate"],
      skills: ["SQL", "Joins", "Indexes", "Dashboards"],
    },
    {
      label: "Cybersecurity",
      description:
        "Learn practical security foundations across web apps, networks, identity, and risk.",
      roles: ["Security Analyst", "AppSec Associate", "SOC Analyst"],
      skills: ["OWASP", "Networking", "Auth", "Threat models"],
    },
    {
      label: "Data Analytics",
      description:
        "Turn raw data into business insight through dashboards, metrics, and storytelling.",
      roles: ["Data Analyst", "Growth Analyst", "Product Analyst"],
      skills: ["Excel", "SQL", "Tableau", "Statistics"],
    },
  ],
};

const faqs = [
  {
    question: "Can I switch between programs later?",
    answer:
      "Yes. We can help you move between programs if your current stage, time commitment, or career goal changes.",
  },
  {
    question: "What is the commitment required?",
    answer:
      "The undergraduate path works best with 10-12 hours per week. The fast-track path is more intensive and needs 30+ hours per week.",
  },
  {
    question: "Will I get a certificate?",
    answer:
      "Yes. You receive a completion certificate after finishing the required modules, projects, and assessments.",
  },
  {
    question: "Are there any hidden costs?",
    answer:
      "No hidden platform fees. Any optional add-ons or exam fees will be shown clearly before enrollment.",
  },
  {
    question: "Who are the mentors?",
    answer:
      "Mentors are working engineers, product builders, and career coaches with real industry experience.",
  },
  {
    question: "Do I need prior coding experience?",
    answer:
      "No for the undergraduate path. For fast-track, basic programming familiarity helps but is not mandatory.",
  },
  {
    question: "Is there a scholarship available?",
    answer:
      "Scholarship and installment options may be available based on cohort, eligibility, and application review.",
  },
];

export default function ProgramsPage() {
  return (
    <MarketingLayout className="bg-[#F9FAFB] text-[#0F172A]">
      <HeroSection className="bg-[#0F172A] py-20 text-white lg:py-24">
        <CenterHero
          title={
            <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Two Programs.
              <br />
              <span className="text-[#FF7A0E]">
                One Goal - Get You Hired.
              </span>
            </h1>
          }
          description={
            <p className="text-base leading-relaxed text-[#E9EAF0]">
              Tailored learning paths designed for where you are now. Whether
              you are starting college or looking for a fast-track into tech, we
              bridge the gap between classroom and career.
            </p>
          }
          actions={
            <>
              <Button
                asChild
                size="lg"
                className="bg-[#FF7A0E] text-white hover:bg-[#E96D00]"
              >
                <Link href="#compare">Compare Programs</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/15 bg-transparent text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="/contact">
                  <MessageSquare className="size-4" />
                  Talk to a Mentor
                </Link>
              </Button>
            </>
          }
        />
      </HeroSection>

      <ProgramSection className="bg-[#F9FAFB] py-16 lg:py-20">
        <ProgramShowcaseCard
          eyebrow={undergraduateProgram.eyebrow}
          title={undergraduateProgram.title}
          description={undergraduateProgram.description}
          chips={undergraduateProgram.chips}
          stats={undergraduateProgram.stats}
          duration={undergraduateProgram.panel.duration}
          priceLabel={undergraduateProgram.panel.priceLabel}
          bullets={undergraduateProgram.panel.bullets}
          cohortDate={undergraduateProgram.panel.cohortDate}
          phases={undergraduateProgram.phases}
          reserveHref="/contact"
          detailsHref="/programs/industry-ready-software-engineer"
          tracks={undergraduateProgram.tracks}
          tone="teal"
        />
      </ProgramSection>

      <ProgramSection className="bg-white py-16 lg:py-24">
        <ProgramShowcaseCard
          eyebrow={graduateProgram.eyebrow}
          title={graduateProgram.title}
          description={graduateProgram.description}
          chips={graduateProgram.chips}
          stats={graduateProgram.stats}
          duration={graduateProgram.quote.duration}
          priceLabel={graduateProgram.panel.priceLabel}
          bullets={graduateProgram.panel.bullets}
          cohortDate={graduateProgram.quote.cohortDate}
          phases={graduateProgram.phases}
          reserveHref="/contact"
          detailsHref="/programs/fast-track-tech-career-program"
          tracks={graduateProgram.tracks}
          tone="orange"
        />
      </ProgramSection>

      <ProgramOutcomesSection />
      <ProgramHiringCompaniesSection />
      <ProgramExpertsSection />
      <ProgramSuccessStoriesSection />

      <ComparisonSection id="compare" className="bg-[#0F172A] text-white">
        <ProgramFitComparison
          left={{
            title: "Undergraduate",
            tone: "teal",
            items: [
              "In your 1st, 2nd, or 3rd year of college",
              "Wanting to build a robust tech foundation",
              "Ready to commit 10-12 hours per week",
            ],
            program: {
              title: undergraduateProgram.title,
              duration: undergraduateProgram.panel.duration,
              description:
                "Best fit when you want a long-term foundation alongside college.",
              href: "/programs/industry-ready-software-engineer",
            },
          }}
          right={{
            title: "Graduate",
            tone: "orange",
            items: [
              "In your final year or already graduated",
              "Looking for immediate career transition",
              "Ready to commit 30+ hours per week",
            ],
            program: {
              title: graduateProgram.title,
              duration: graduateProgram.quote.duration,
              description:
                "Best fit when you want an intensive transition with placement focus.",
              href: "/programs/fast-track-tech-career-program",
            },
          }}
        />
      </ComparisonSection>

      <FAQSection className="bg-[#F9FAFB] py-16 lg:py-20">
        <SimpleFAQSection
          title="Frequently Asked Questions"
          description="Quick answers to the most common questions learners ask before choosing a program."
          faqs={faqs}
          link={{ label: "Talk to admissions", href: "/contact" }}
        />
      </FAQSection>

      <CTASection className="bg-white py-16 lg:py-20">
        <Box className="rounded-xl border border-white/10 bg-[#1E293B] px-6 py-12 text-white shadow-[0_28px_80px_rgba(15,23,42,0.18)] lg:px-12">
          <CenterCTA
            title="Still Not Sure? Let's Figure It Out."
            description="Book a free 15-minute consultation with a career expert to find your ideal path."
            primaryAction={
              <Button
                asChild
                size="lg"
                className="bg-[#FF7A0E] text-white hover:bg-[#E96D00]"
              >
                <Link href="/contact">
                  <CalendarDays className="size-4" />
                  Talk to a Mentor
                </Link>
              </Button>
            }
            secondaryAction={
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="bg-white/10 text-white hover:bg-white/15"
              >
                <Link href="/pricing">View Pricing</Link>
              </Button>
            }
          />
        </Box>
      </CTASection>
    </MarketingLayout>
  );
}
