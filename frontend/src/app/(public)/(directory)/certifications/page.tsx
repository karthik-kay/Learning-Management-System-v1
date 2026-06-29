import { CertificationSection } from "@/components/public/sections/certifications/CertificationSection";
import { CertificationCatalog } from "@/components/public/sections/certifications/variants/CertificationCatalog";
import { CTASection } from "@/components/public/sections/cta/CTASection";
import CenterCTA from "@/components/public/sections/cta/variants/CenterCTA";
import { HeroSection } from "@/components/public/sections/hero/HeroSection";
import { CenterHero } from "@/components/public/sections/hero/variants/CenterHero";
import { Box } from "@/components/shared/primitives";
import { Button } from "@/components/ui/button";
import { Award, ShieldCheck } from "lucide-react";
import Link from "next/link";

const certifications = [
  {
    id: "program-full-stack",
    title: "Full Stack Software Engineer Certificate",
    description:
      "A program-level credential for learners who complete frontend, backend, databases, deployment, and capstone work.",
    type: "Program" as const,
    domain: "Full Stack" as const,
    level: "Career-ready",
    duration: "24 months",
    skills: ["React", "Django", "PostgreSQL", "AWS"],
    href: "/certifications/full-stack-software-engineer",
  },
  {
    id: "track-ai-engineer",
    title: "AI Engineer Track Certificate",
    description:
      "Issued after completing applied AI modules, LLM workflows, evaluation, and production AI project work.",
    type: "Track" as const,
    domain: "AI" as const,
    level: "Specialized",
    duration: "12 weeks",
    skills: ["Python", "RAG", "NLP", "MLOps"],
    href: "/certifications/ai-engineer-track",
  },
  {
    id: "course-dsa",
    title: "Data Structures and Algorithms Certificate",
    description:
      "A course certificate focused on problem solving, algorithmic thinking, and interview-ready coding practice.",
    type: "Course" as const,
    domain: "Full Stack" as const,
    level: "Foundation",
    duration: "8 weeks",
    skills: ["Arrays", "Trees", "Graphs", "Dynamic Programming"],
    href: "/certifications/dsa",
  },
  {
    id: "track-data-analytics",
    title: "Data Analytics Track Certificate",
    description:
      "A track credential covering SQL, dashboards, Python analytics, storytelling, and business insight projects.",
    type: "Track" as const,
    domain: "Data" as const,
    level: "Applied",
    duration: "10 weeks",
    skills: ["SQL", "Pandas", "Power BI", "Statistics"],
    href: "/certifications/data-analytics-track",
  },
  {
    id: "track-devops-cloud",
    title: "Cloud and DevOps Certificate",
    description:
      "Credential for deployment, CI/CD, Docker, Linux, cloud fundamentals, and production operations workflows.",
    type: "Track" as const,
    domain: "DevOps" as const,
    level: "Specialized",
    duration: "10 weeks",
    skills: ["Docker", "CI/CD", "Linux", "AWS"],
    href: "/certifications/cloud-devops",
  },
  {
    id: "course-security",
    title: "Secure Web Development Certificate",
    description:
      "A course certificate for authentication, authorization, OWASP risks, secure APIs, and defensive coding.",
    type: "Course" as const,
    domain: "Security" as const,
    level: "Practical",
    duration: "6 weeks",
    skills: ["OWASP", "JWT", "API Security", "Auth"],
    href: "/certifications/secure-web-development",
  },
];

export default function CertificationsPage() {
  return (
    <>
      <HeroSection className="bg-[#0F172A] py-20 text-white lg:py-24">
        <CenterHero
          badge={
            <span className="inline-flex items-center gap-2 rounded-full border border-[#38A3A5]/30 bg-[#38A3A5]/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#57CC99]">
              <Award className="size-4" />
              Certifications
            </span>
          }
          title={
            <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Credentials That Prove
              <br />
              <span className="text-[#FF7A0E]">Real Skill.</span>
            </h1>
          }
          description={
            <p className="text-base leading-relaxed text-[#E9EAF0]">
              Program, track, and course certificates designed around projects,
              assessments, and verifiable outcomes.
            </p>
          }
          actions={
            <>
              <Button
                asChild
                size="lg"
                className="bg-[#FF7A0E] text-white hover:bg-[#E86C0D]"
              >
                <Link href="#certifications">Browse Certificates</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/15 bg-transparent text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="/verify">
                  <ShieldCheck className="size-4" />
                  Verify Certificate
                </Link>
              </Button>
            </>
          }
        />
      </HeroSection>

      <CertificationSection
        id="certifications"
        className="bg-[#F9FAFB]"
        title={
          <h2 className="text-3xl font-bold tracking-tight text-[#0F172A]">
            Certification Library
          </h2>
        }
        description={
          <p className="max-w-2xl text-sm leading-relaxed text-[#6B7280]">
            Search by skill, filter by certification type, or narrow by domain
            to find the credential that matches your learning goal.
          </p>
        }
      >
        <CertificationCatalog certifications={certifications} />
      </CertificationSection>

      <CTASection className="bg-white py-16 lg:py-20">
        <Box className="rounded-xl border border-white/10 bg-[#1E293B] px-6 py-12 text-white shadow-[0_28px_80px_rgba(15,23,42,0.18)] lg:px-12">
          <CenterCTA
            eyebrow="Certificate Verification"
            title="Need to Verify a LearnerSlate Certificate?"
            description="Use a credential ID to confirm certificate ownership, completion status, and issue date."
            primaryAction={
              <Button
                asChild
                size="lg"
                className="bg-[#38A3A5] text-white hover:bg-[#22577A]"
              >
                <Link href="/verify">Verify Certificate</Link>
              </Button>
            }
            secondaryAction={
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="bg-white/10 text-white hover:bg-white/15"
              >
                <Link href="/contact">Contact Support</Link>
              </Button>
            }
          />
        </Box>
      </CTASection>
    </>
  );
}
