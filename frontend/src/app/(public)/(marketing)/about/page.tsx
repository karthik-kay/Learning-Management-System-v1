import { MarketingLayout } from "@/components/public/layouts/MarketingLayout";
import { CommunitySection } from "@/components/public/sections/community/CommunitySection";
import { ContentSection } from "@/components/public/sections/content/ContentSection";
import { SplitContent } from "@/components/public/sections/content/variants/SplitContent";
import { CTASection } from "@/components/public/sections/cta/CTASection";
import { FeatureSection } from "@/components/public/sections/feature/FeatureSection";
import SimpleFeatureSection from "@/components/public/sections/feature/variants/SimpleFeatures";
import { GridSection } from "@/components/public/sections/grid/GridSection";
import { ThreeColumnGrid } from "@/components/public/sections/grid/variants/ThreeColumnGrid";
import { HeroSection } from "@/components/public/sections/hero/HeroSection";
import { CenterHero } from "@/components/public/sections/hero/variants/CenterHero";
import { SplitHero } from "@/components/public/sections/hero/variants/SplitHero";
import { LogoCloudSection } from "@/components/public/sections/logoCloud/LogoCloudSection";
import { PeopleSection } from "@/components/public/sections/people/PeopleSection";
import { TeamGrid } from "@/components/public/sections/people/variants/TeamGrid";
import { FeatureCard } from "@/components/public/widgets/cards/FeatureCard";
import { Divider, Inline, Stack } from "@/components/shared/primitives";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { TrustedStatsGrid } from "@/components/public/sections/logoCloud/variants/TrustedChips";
import StatCard from "@/components/public/widgets/cards/StatCard";
import { LogoChip } from "@/components/public/widgets/display/LogoChip";
import { Metric } from "@/components/public/widgets/display/Metric";
import { GraduationCap, Users, FolderKanban, Trophy } from "lucide-react";
import CenterCTA from "@/components/public/sections/cta/variants/CenterCTA";

const stats = [
  {
    value: "15K+",
    label: "Students",
    icon: <GraduationCap />,
  },
  {
    value: "100+",
    label: "Mentors",
    icon: <Users />,
  },
  {
    value: "500+",
    label: "Projects",
    icon: <FolderKanban />,
  },
  {
    value: "94%",
    label: "Success Rate",
    icon: <Trophy />,
  },
];

const features = [
  {
    title: "Industry Mentorship",
    description:
      "Learn directly from experienced professionals who bring real-world insights and practical guidance.",
  },
  {
    title: "Project-Based Learning",
    description:
      "Build portfolio-worthy projects that help you apply concepts and gain hands-on experience.",
  },
  {
    title: "Structured Roadmaps",
    description:
      "Follow clear learning paths designed to take you from beginner to job-ready.",
  },
  {
    title: "Career-Focused Outcomes",
    description:
      "Every program is built around skills, employability, and long-term professional growth.",
  },
  {
    title: "Supportive Community",
    description:
      "Collaborate with learners, mentors, and peers who are committed to growth and excellence.",
  },
  {
    title: "Continuous Growth",
    description:
      "Develop the mindset, confidence, and adaptability needed to succeed in a changing world.",
  },
];

const members = [
  {
    image: (
      <Image
        src="/team/founder.jpg"
        alt="Founder"
        width={400}
        height={400}
        className="aspect-square object-cover rounded-xl"
      />
    ),
    name: "Arjun Rao",
    jobTitle: "Founder & CEO",
    jobDescription:
      "Passionate about building outcome-driven education and helping learners achieve meaningful careers.",
  },
  {
    image: (
      <Image
        src="/team/learning.jpg"
        alt="Head of Learning"
        width={400}
        height={400}
        className="aspect-square object-cover rounded-xl"
      />
    ),
    name: "Priya Sharma",
    jobTitle: "Head of Learning",
    jobDescription:
      "Designs practical learning experiences that bridge the gap between education and industry.",
  },
  {
    image: (
      <Image
        src="/team/mentor.jpg"
        alt="Mentor Lead"
        width={400}
        height={400}
        className="aspect-square object-cover rounded-xl"
      />
    ),
    name: "Rahul Verma",
    jobTitle: "Mentor Lead",
    jobDescription:
      "Connects learners with industry experts and mentors who provide real-world guidance.",
  },
  {
    image: (
      <Image
        src="/team/community.jpg"
        alt="Community Manager"
        width={400}
        height={400}
        className="aspect-square object-cover rounded-xl"
      />
    ),
    name: "Ananya Patel",
    jobTitle: "Community Manager",
    jobDescription:
      "Builds vibrant learning communities that encourage collaboration and growth.",
  },
  {
    image: (
      <Image
        src="/team/product.jpg"
        alt="Product Lead"
        width={400}
        height={400}
        className="aspect-square object-cover rounded-xl"
      />
    ),
    name: "Vikram Singh",
    jobTitle: "Product Lead",
    jobDescription:
      "Shapes the LearnerSlate platform to deliver an exceptional learning experience.",
  },
  {
    image: (
      <Image
        src="/team/career.jpg"
        alt="Career Coach"
        width={400}
        height={400}
        className="aspect-square object-cover rounded-xl"
      />
    ),
    name: "Neha Reddy",
    jobTitle: "Career Coach",
    jobDescription:
      "Guides learners through career planning, interviews, and professional growth.",
  },
];

export default function AboutPage() {
  return (
    // ─── Page wrapper: dark base ───────────────────────────────────────────────

    <MarketingLayout className=" text-white">
      {/* ── HERO ── py-16 (64px) ──────────────────────────────────────────── */}
      <HeroSection className="py-16 bg-[#0F172A]">
        <SplitHero
          badge="OUR STORY"
          title={
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight tracking-tight text-white">
              Built by Educators.
              <br />
              <span className="text-[#FF7A0E]">Driven by Outcomes.</span>
            </h1>
          }
          description={
            <p className="text-base text-slate-400 leading-relaxed max-w-[480px]">
              LearnerSlate was born from a simple belief: students deserve a
              learning experience that bridges the gap between academic
              knowledge and industry expectations.
            </p>
          }
          actions={
            <Inline gap={12} justify="start" className="flex-col sm:flex-row">
              <Button asChild size="lg">
                <Link href="/programs">Explore Programs</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white/20 text-black hover:bg-white/10 hover:text-white"
              >
                <Link href="#team">Meet the Team</Link>
              </Button>
            </Inline>
          }
          stats={null}
        />
      </HeroSection>

      {/* ── OUR STORY / SPLIT CONTENT ── py-12 (48px) ────────────────────── */}
      {/*
          The "blue text" section u mentioned — the right side paragraphs use
          #38A3A5 (teal) for the body copy to give that distinct blue-ish feel
          against the dark bg. Left side stays white headings + orange label.
          A subtle left border accent (border-l-2 border-[#38A3A5]) on each
          paragraph block makes it pop like in the mockup.
        */}
      <ContentSection className="py-12">
        <SplitContent
          left={
            <Stack gap={24}>
              <p className="text-sm font-semibold tracking-widest uppercase text-[#FF7A0E]">
                Our Story
              </p>

              <h2 className="text-3xl lg:text-4xl font-bold leading-tight text-white">
                We didn&apos;t just want to build another platform.
              </h2>

              <Divider className="max-w-24 border-white/20" />

              <p className="text-sm text-slate-500 tracking-wider">EST. 2024</p>
            </Stack>
          }
          right={
            <Stack gap={20}>
              {/* Blue-tinted paragraphs — the "blue text" from the image */}
              <div className="pl-4 border-l-2 border-[#38A3A5]">
                <p className="text-base leading-relaxed text-[#38A3A5]">
                  LearnerSlate began with a simple observation: students were
                  spending years learning concepts, yet graduating without the
                  confidence, portfolio, or practical experience needed to
                  succeed in the real world.
                </p>
              </div>

              <div className="pl-4 border-l-2 border-[#22577A]">
                <p className="text-base leading-relaxed text-black">
                  We saw talented learners struggle to bridge the gap between
                  theory and industry expectations. Traditional education
                  provided knowledge, but not always the guidance, mentorship,
                  and structure required to turn that knowledge into outcomes.
                </p>
              </div>

              <div className="pl-4 border-l-2 border-[#57CC99]">
                <p className="text-base leading-relaxed text-slate-300">
                  That is why LearnerSlate was built — to provide structured
                  learning paths, expert mentorship, hands-on projects, and a
                  thriving community that helps learners move from curiosity to
                  career readiness.
                </p>
              </div>
            </Stack>
          }
        />
      </ContentSection>

      {/* ── MISSION / 3-COLUMN GRID ── py-12 (48px) ──────────────────────── */}
      {/*
          Cards: light surface on dark — bg-white/5 + border border-white/10
          This gives that "light card" look u described without going full white
        */}
      <GridSection
        className="py-12 bg-[#0F172A]"
        title={
          <h2 className="text-3xl lg:text-4xl font-bold text-white">
            Our Mission
          </h2>
        }
        description={
          <p className="max-w-2xl text-slate-400">
            We believe education should create opportunities, build confidence,
            and empower learners to achieve meaningful career outcomes.
          </p>
        }
      >
        <ThreeColumnGrid>
          <FeatureCard
            className="bg-white/5 border border-white/10 rounded-2xl p-6 text-white hover:bg-white/10 transition-colors"
            title="Our Mission"
            titleClassName="text-white font-semibold"
            descriptionClassName="text-slate-400"
            description="To bridge the gap between learning and industry by providing structured, practical, and outcome-focused education."
          />
          <FeatureCard
            className="bg-white/5 border border-white/10 rounded-2xl p-6 text-white hover:bg-white/10 transition-colors"
            title="Our Vision"
            titleClassName="text-white font-semibold"
            descriptionClassName="text-slate-400"
            description="To become the most trusted learning ecosystem where ambitious learners transform their potential into real-world success."
          />
          <FeatureCard
            className="bg-white/5 border border-white/10 rounded-2xl p-6 text-white hover:bg-white/10 transition-colors"
            title="Our Values"
            titleClassName="text-white font-semibold"
            descriptionClassName="text-slate-400"
            description="Growth, community, excellence, and continuous learning guide every decision we make."
          />
        </ThreeColumnGrid>
      </GridSection>

      {/* ── WHY LEARNERSLATE ── py-10 (40px) ─────────────────────────────── */}
      <FeatureSection
        className="py-10"
        title={
          <h2 className="text-3xl lg:text-4xl font-bold text-black">
            Why LearnerSlate
          </h2>
        }
        description={
          <p className="text-slate-400">
            Everything we build is designed to help learners move from knowledge
            to outcomes.
          </p>
        }
      >
        {/*
            SimpleFeatureSection items inherit the dark context.
            If your SimpleFeatureSection accepts className, pass it through.
            Otherwise wrap in a div to add icon accent coloring.
          */}
        <div className="[&_h3]:text-white [&_p]:text-slate-400 [&_svg]:text-[#FF7A0E]">
          <SimpleFeatureSection features={features} />
        </div>
      </FeatureSection>

      {/* ── TEAM ── py-12 (48px) ──────────────────────────────────────────── */}
      <PeopleSection
        className="py-12"
        title={
          <h2 className="text-3xl lg:text-4xl font-bold text-black">
            Meet the Team
          </h2>
        }
        description={
          <p className="max-w-2xl text-slate-400">
            Behind LearnerSlate is a team of educators, mentors, and builders
            committed to helping learners unlock their full potential.
          </p>
        }
        actions={
          <Button
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10 hover:text-white"
          >
            Join Our Mission
          </Button>
        }
      >
        {/*
            Team cards: wrap to get dark card styling on the TeamGrid items
          */}
        <div className="[&_.team-card]:bg-white/5 [&_.team-card]:border [&_.team-card]:border-white/10 [&_.team-card]:rounded-2xl [&_h3]:text-white [&_p]:text-slate-400 [&_.job-title]:text-[#38A3A5]">
          <TeamGrid members={members} />
        </div>
      </PeopleSection>

      {/* ── STATS / LOGO CLOUD ── py-10 (40px) ───────────────────────────── */}
      <LogoCloudSection
        className="py-10 bg-[#0F172A]"
        title={
          <span className="text-white">Trusted by Learners Across India</span>
        }
        description={
          <span className="text-slate-400">
            Thousands of learners have trusted LearnerSlate to accelerate their
            careers.
          </span>
        }
      >
        {/*
            StatCards on dark bg — override to get light card look
          */}
        <TrustedStatsGrid>
          {stats.map((stat) => (
            <StatCard
              key={stat.label}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors"
              logo={
                <LogoChip className="bg-[#FF7A0E]/10 text-[#FF7A0E]">
                  {stat.icon}
                </LogoChip>
              }
              metric={
                <Metric
                  value={stat.value}
                  label={stat.label}
                  valueClassName="text-white font-bold text-2xl"
                  labelClassName="text-slate-400 text-sm"
                />
              }
            />
          ))}
        </TrustedStatsGrid>
      </LogoCloudSection>

      {/* ── CTA ── py-16 (64px) ───────────────────────────────────────────── */}
      {/*
          CTA gets a slightly elevated surface — bg-white/5 with a border + 
          rounded-3xl to frame it distinctly from the raw dark bg around it
        */}
      <CTASection className="py-16 px-6 ">
        <div className="bg-[#0F172A]  border border-white/10 rounded-3xl px-8 py-14 text-center">
          <CenterCTA
            title={
              <span className=" text-white text-3xl lg:text-4xl font-bold">
                Ready to Start Your Journey?
              </span>
            }
            description={
              <span className="text-slate-400 text-base">
                Join thousands of learners building practical skills, gaining
                mentorship, and creating career opportunities through
                LearnerSlate.
              </span>
            }
            primaryAction={
              <Button asChild size="lg">
                <Link href="/programs">Explore Programs</Link>
              </Button>
            }
            secondaryAction={
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white/20 text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="/contact">Contact Us</Link>
              </Button>
            }
          />
        </div>
      </CTASection>
    </MarketingLayout>
  );
}
