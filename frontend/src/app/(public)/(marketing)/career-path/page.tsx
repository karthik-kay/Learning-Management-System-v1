import { MarketingLayout } from "@/components/public/layouts/MarketingLayout";
import { CareerSection } from "@/components/public/sections/career/CareerSection";
import { CareerPathGrid } from "@/components/public/sections/career/variants/CareerPathGrid";
import { FeaturedCareerSection } from "@/components/public/sections/career/variants/FeaturedCareerSection";
import { ComparisonSection } from "@/components/public/sections/comparision/ComparisonSection";
import { SalaryComparison } from "@/components/public/sections/comparision/variants/SalaryComparison";
import { CTASection } from "@/components/public/sections/cta/CTASection";
import CenterCTA from "@/components/public/sections/cta/variants/CenterCTA";
import { GridSection } from "@/components/public/sections/grid/GridSection";
import { HeroSection } from "@/components/public/sections/hero/HeroSection";
import { SplitHero } from "@/components/public/sections/hero/variants/SplitHero";
import { CareerMetricPanel } from "@/components/public/widgets/display/CareerMetricPanel";
import { Box, Inline } from "@/components/shared/primitives";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import Link from "next/link";

const featuredCareers = [
  {
    slug: "ai-and-machine-learning",
    label: "AI Engineer",
    eyebrow: "Most Popular 2026",
    title: "Applied Artificial Intelligence Engineer",
    description:
      "Master LLMs, RAG architectures, and fine-tuning models to build the next generation of AI-native applications.",
    salary: "INR 18.4 LPA",
    range: "INR 12L to 28L",
    insight:
      "High demand across fintech, SaaS, e-commerce, and enterprise automation teams.",
    tools: ["Python", "PyTorch", "TensorFlow", "NLP", "Cloud MLOps"],
    partners: ["Google India", "Zomato", "Razorpay", "12+ others"],
  },
  {
    slug: "full-stack-development",
    label: "Full Stack Dev",
    eyebrow: "Best Seller",
    title: "Full Stack Product Engineer",
    description:
      "Build complete web products across frontend, backend, databases, deployment, and product thinking.",
    salary: "INR 14.2 LPA",
    range: "INR 8L to 22L",
    insight:
      "Consistent demand in startups and product companies for engineers who can ship end-to-end.",
    tools: ["Next.js", "Node.js", "Django", "PostgreSQL", "AWS"],
    partners: ["Freshworks", "Zoho", "PhonePe", "10+ others"],
  },
  {
    slug: "data-scientist",
    label: "Data Scientist",
    eyebrow: "High Growth",
    title: "Data Scientist",
    description:
      "Learn statistics, machine learning, analytics, and deployment workflows for business decision systems.",
    salary: "INR 16.8 LPA",
    range: "INR 9L to 25L",
    insight:
      "Growing roles in analytics, AI product teams, risk systems, and growth strategy.",
    tools: ["Pandas", "Scikit-learn", "SQL", "MLflow", "Tableau"],
    partners: ["Swiggy", "Meesho", "Flipkart", "8+ others"],
  },
];

const careerPaths = [
  {
    slug: "ai-and-machine-learning",
    title: "AI and Machine Learning",
    tag: "Hot",
    description:
      "Master Python, deep learning, NLP, and MLOps to build intelligent software systems.",
    salary: "INR 18.4 LPA",
    skills: ["TensorFlow", "NLP", "Computer Vision"],
  },
  {
    slug: "full-stack-development",
    title: "Full Stack Development",
    tag: "Best Seller",
    description:
      "Build end-to-end applications from frontend interfaces to backend APIs and databases.",
    salary: "INR 14.2 LPA",
    skills: ["Next.js", "Django", "PostgreSQL"],
  },
  {
    slug: "data-scientist",
    title: "Data Scientist",
    tag: "Trending",
    description:
      "Extract insights from large datasets using statistics, machine learning, and analytics.",
    salary: "INR 16.8 LPA",
    skills: ["Pandas", "Scikit-learn", "SQL"],
  },
  {
    slug: "backend-architect",
    title: "Backend Architect",
    tag: "Advanced",
    description:
      "Design scalable APIs, distributed systems, queues, caching, and cloud-ready services.",
    salary: "INR 15.5 LPA",
    skills: ["System Design", "Redis", "AWS"],
  },
  {
    slug: "devops-engineer",
    title: "DevOps Engineer",
    tag: "High Demand",
    description:
      "Own CI/CD, containers, observability, infrastructure automation, and cloud reliability.",
    salary: "INR 17.0 LPA",
    skills: ["Docker", "Kubernetes", "Terraform"],
  },
  {
    slug: "frontend-specialist",
    title: "Frontend Specialist",
    tag: "Creative Tech",
    description:
      "Craft polished product interfaces with React, design systems, accessibility, and performance.",
    salary: "INR 12.0 LPA",
    skills: ["React", "TypeScript", "Design Systems"],
  },
];

const salaryBars = [
  {
    role: "AI Engineer",
    value: "INR 18.4L",
    width: "94%",
    color: "bg-[#38A3A5]",
  },
  {
    role: "DevOps Engineer",
    value: "INR 17.0L",
    width: "87%",
    color: "bg-[#57CC99]",
  },
  {
    role: "Data Scientist",
    value: "INR 16.8L",
    width: "84%",
    color: "bg-[#38A3A5]",
  },
  {
    role: "Backend Architect",
    value: "INR 15.5L",
    width: "78%",
    color: "bg-[#FF7A0E]",
  },
  {
    role: "Full Stack Dev",
    value: "INR 14.2L",
    width: "71%",
    color: "bg-[#22577A]",
  },
];

const salaryCards = [
  {
    label: "Fresher",
    range: "0 to 2 years",
    value: "INR 6.5L",
    note: "Average starting package across focused career tracks.",
  },
  {
    label: "Mid-Level",
    range: "3 to 6 years",
    value: "INR 18L",
    note: "Typical jump for specialized domain contributors.",
  },
  {
    label: "Senior",
    range: "6+ years",
    value: "INR 42L",
    note: "Top outcomes in technical leadership and architecture roles.",
  },
];

export default function CareerPathPage() {
  return (
    <MarketingLayout className="bg-[#F9FAFB] text-[#0F172A]">
      <HeroSection className="bg-[#0F172A] py-20 text-white lg:py-24">
        <SplitHero
          badge={
            <Badge className="border-orange-500/30 bg-orange-500/10 text-orange-300">
              <Sparkles className="size-3" />
              Career Paths
            </Badge>
          }
          title={
            <h1 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Find Your Path in Software.
              <br />
              <span className="text-[#FF7A0E]">Then Own It.</span>
            </h1>
          }
          description={
            <p className="max-w-xl text-base leading-relaxed text-[#E9EAF0]">
              Structured roadmaps designed to take you from curious learner to
              job-ready engineer with clear skills, projects, mentors, and
              salary-backed direction.
            </p>
          }
          actions={
            <Inline gap={12} className="flex-col sm:flex-row" justify="start">
              <Button
                asChild
                size="lg"
                className="bg-[#FF7A0E] text-white hover:bg-[#E96D00]"
              >
                <Link href="#paths">
                  Explore Paths
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/15 bg-transparent text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="/contact">Take Assessment</Link>
              </Button>
            </Inline>
          }
          media={
            <Box className="relative min-h-[340px]">
              <CareerMetricPanel
                className="absolute right-4 top-2 border-orange-500/60"
                label="Highest Package"
                value="INR 42L"
                caption="+12% YoY"
              />
              <CareerMetricPanel
                className="absolute left-0 top-28 border-cyan-400/60"
                label="Placement Rate"
                value="94%"
                caption="Verified stats"
              />
              <CareerMetricPanel
                className="absolute bottom-4 right-10 border-emerald-400/60"
                label="Avg. Transition"
                value="6 Months"
                caption="Fast-track"
              />
            </Box>
          }
        />
      </HeroSection>

      <CareerSection className="bg-white">
        <FeaturedCareerSection careers={featuredCareers} />
      </CareerSection>

      <GridSection
        id="paths"
        className="bg-[#F9FAFB] py-16 lg:py-20"
        title={
          <h2 className="text-3xl font-bold tracking-tight text-[#0F172A]">
            All Career Specializations
          </h2>
        }
        description={
          <p className="max-w-xl text-sm leading-relaxed text-[#6B7280]">
            Pick a destination, then follow the right skill sequence, projects,
            and interview preparation path.
          </p>
        }
      >
        <CareerPathGrid careers={careerPaths} />
      </GridSection>

      <ComparisonSection
        className="bg-[#0F172A] text-white"
        description={
          <p className="text-sm font-semibold text-slate-400">
            Compensation Growth
          </p>
        }
        title={
          <h2 className="text-3xl font-bold tracking-tight">
            Salary Comparison by Role
          </h2>
        }
      >
        <SalaryComparison
          bars={salaryBars}
          cards={salaryCards}
          footnote="Based on placement records and public salary bands across Indian product and service tech roles."
        />
      </ComparisonSection>

      <CTASection className="bg-white py-16 lg:py-20">
        <Box className="rounded-xl border border-[#E9EAF0] bg-[#F9FAFB] px-6 py-12 shadow-[0_24px_70px_rgba(15,23,42,0.06)]">
          <CenterCTA
            title="Not Sure Which Path Is Right for You?"
            description="Take our 10-minute career assessment. We will map your current skills and interests to the software career path where you are most likely to grow."
            primaryAction={
              <Button
                asChild
                size="lg"
                className="bg-[#FF7A0E] hover:bg-[#E96C0D]"
              >
                <Link href="/contact">Start Career Assessment</Link>
              </Button>
            }
            secondaryAction={
              <Button asChild size="lg" variant="outline">
                <Link href="/faq">View FAQ</Link>
              </Button>
            }
          />
          <Inline gap={24} justify="center" wrap className="mt-8">
            <span className="inline-flex items-center gap-2 text-sm text-[#38A3A5]">
              <CheckCircle2 className="size-4" />
              Personalized guidance
            </span>
            <span className="inline-flex items-center gap-2 text-sm text-[#38A3A5]">
              <CheckCircle2 className="size-4" />
              Zero cost
            </span>
          </Inline>
        </Box>
      </CTASection>
    </MarketingLayout>
  );
}
