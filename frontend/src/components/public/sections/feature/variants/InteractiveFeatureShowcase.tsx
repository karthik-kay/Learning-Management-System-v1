"use client";

import { useMemo, useState } from "react";

import { Grid, Stack } from "@/components/shared/primitives";
import { FeatureCard } from "@/components/public/widgets/cards/FeatureCard";
import { FeatureMockup } from "@/components/public/widgets/display/FeatureMockup";
import type { FeatureMockupType } from "@/components/public/widgets/display/FeatureMockup";
import { FeatureShowcase } from "@/components/public/widgets/display/FeatureShowcase";
import { cn } from "@/lib/utils";

interface InteractiveFeature {
  id: string;
  title: string;
  description: string;
  ctaLabel: string;
  showcase: {
    eyebrow: string;
    title: string;
    description: string;
    bullets: string[];
    ctaLabel: string;
    href: string;
    mockupType: FeatureMockupType;
  };
}

const features: InteractiveFeature[] = [
  {
    id: "mentor",
    title: "AI Mentor",
    description: "Guidance that understands your progress and next steps.",
    ctaLabel: "Try it out",
    showcase: {
      eyebrow: "Personalized Support",
      title: "AI mentorship that keeps learners moving",
      description:
        "Learners get timely explanations, revision prompts, and project guidance without waiting for the next class.",
      bullets: [
        "Context-aware help across lessons and projects",
        "Suggested practice based on weak areas",
        "Always-on guidance between mentor sessions",
      ],
      ctaLabel: "Explore mentorship",
      href: "/programs",
      mockupType: "mentor",
    },
  },
  {
    id: "projects",
    title: "Real Projects",
    description: "Build portfolio-ready work based on practical briefs.",
    ctaLabel: "Project spotlight",
    showcase: {
      eyebrow: "Proof Of Work",
      title: "Project-based learning from day one",
      description:
        "Every track pushes learners toward shipped work, reviews, and portfolio proof they can talk about in interviews.",
      bullets: [
        "Guided milestones from planning to review",
        "Portfolio projects mapped to career tracks",
        "Mentor feedback before final submission",
      ],
      ctaLabel: "View programs",
      href: "/programs",
      mockupType: "projects",
    },
  },
  {
    id: "certificates",
    title: "Certifications",
    description: "Verified credentials for completed skills and programs.",
    ctaLabel: "All certificates",
    showcase: {
      eyebrow: "Credentials",
      title: "Certificates that are easy to verify",
      description:
        "Learners can share verified completion proof for programs, projects, and skill milestones.",
      bullets: [
        "Public verification-ready credential pages",
        "Program and skill-level certificates",
        "Designed for resumes, LinkedIn, and hiring teams",
      ],
      ctaLabel: "Verify certificate",
      href: "/verify",
      mockupType: "certificate",
    },
  },
  {
    id: "dashboard",
    title: "Student Dashboard",
    description: "A focused home for progress, goals, and next actions.",
    ctaLabel: "Preview",
    showcase: {
      eyebrow: "Learner Control",
      title: "One dashboard for the entire journey",
      description:
        "Learners can track progress, projects, certificates, practice time, and upcoming sessions in one place.",
      bullets: [
        "Progress and weekly learning visibility",
        "Course, project, and certificate summaries",
        "Clear next actions for every learner",
      ],
      ctaLabel: "Start learning",
      href: "/register",
      mockupType: "dashboard",
    },
  },
  {
    id: "live-classes",
    title: "Live Classes",
    description: "Mentor-led sessions, structured discussions, and Q&A.",
    ctaLabel: "See schedule",
    showcase: {
      eyebrow: "Live Learning",
      title: "Live classes with mentor support",
      description:
        "Programs combine structured self-learning with live sessions, Q&A, and review checkpoints.",
      bullets: [
        "Scheduled mentor-led sessions",
        "Doubt solving and practical walkthroughs",
        "Session flow designed around outcomes",
      ],
      ctaLabel: "Book a demo",
      href: "/demo",
      mockupType: "live-class",
    },
  },
  {
    id: "ide",
    title: "IDE",
    description: "Code, run, and submit work inside the platform.",
    ctaLabel: "Try sandbox",
    showcase: {
      eyebrow: "Infrastructure",
      title: "Cloud integrated IDE, built in",
      description:
        "Learners can practice in a browser-based coding workspace without local setup or environment issues.",
      bullets: [
        "Pre-configured coding environments",
        "Run Python, Node.js, and project tooling in one place",
        "Practice, submit, and review without context switching",
      ],
      ctaLabel: "Try the sandbox",
      href: "/practice",
      mockupType: "ide",
    },
  },
];

interface InteractiveFeatureShowcaseProps {
  className?: string;
}

export function InteractiveFeatureShowcase({
  className,
}: InteractiveFeatureShowcaseProps) {
  const [activeFeatureId, setActiveFeatureId] = useState("ide");

  const activeFeature = useMemo(
    () =>
      features.find((feature) => feature.id === activeFeatureId) ?? features[0],
    [activeFeatureId],
  );

  return (
    <Stack gap={48} className={className}>
      <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" gap={32}>
        {features.map((feature) => (
          <FeatureCard
            key={feature.id}
            title={feature.title}
            description={feature.description}
            ctaLabel={feature.ctaLabel}
            active={feature.id === activeFeature.id}
            onClick={() => setActiveFeatureId(feature.id)}
          />
        ))}
      </Grid>

      <FeatureShowcase
        eyebrow={activeFeature.showcase.eyebrow}
        title={activeFeature.showcase.title}
        description={activeFeature.showcase.description}
        bullets={activeFeature.showcase.bullets}
        ctaLabel={activeFeature.showcase.ctaLabel}
        href={activeFeature.showcase.href}
        mockup={
          <FeatureMockup
            type={activeFeature.showcase.mockupType}
            className={cn("min-h-[320px]")}
          />
        }
      />
    </Stack>
  );
}
