import { EventSection } from "@/components/public/sections/events/EventSection";
import { BountyLeaderboard } from "@/components/public/sections/events/variants/BountyLeaderboard";
import { EventCategorySection } from "@/components/public/sections/events/variants/EventCategorySection";
import { EventHeroCarousel } from "@/components/public/sections/events/variants/EventHeroCarousel";
import { EventNotifyStrip } from "@/components/public/sections/events/variants/EventNotifyStrip";
import { CTASection } from "@/components/public/sections/cta/CTASection";
import CenterCTA from "@/components/public/sections/cta/variants/CenterCTA";
import { HeroSection } from "@/components/public/sections/hero/HeroSection";
import { CenterHero } from "@/components/public/sections/hero/variants/CenterHero";
import { EventCardData } from "@/components/public/widgets/cards/EventCard";
import { Box, Stack } from "@/components/shared/primitives";
import { Button } from "@/components/ui/button";
import { CalendarDays, Users } from "lucide-react";
import Link from "next/link";

const heroEvents: EventCardData[] = [
  {
    id: "hero-webinar-ai",
    type: "Webinar",
    title: "AI Engineering Career Roadmap",
    date: "July 12, 2026",
    time: "7:00 PM IST",
    href: "/events/ai-engineering-roadmap",
    ctaLabel: "Register Now",
  },
  {
    id: "hero-hackathon",
    type: "Hackathon",
    title: "Build a Hiring-Ready AI Product",
    date: "July 20, 2026",
    time: "10:00 AM IST",
    href: "/events/ai-product-hackathon",
    ctaLabel: "Join",
  },
  {
    id: "hero-bounty",
    type: "Bounty",
    title: "Bug Hunt: Secure the API",
    date: "Open this week",
    href: "/events/api-security-bounty",
    ctaLabel: "Participate",
  },
];

const webinars: EventCardData[] = [
  {
    id: "webinar-system-design",
    type: "Webinar",
    title: "System Design for First Jobs",
    date: "July 14, 2026",
    time: "8:00 PM IST",
    mentor: "Arjun Rao",
    href: "/events/system-design-first-jobs",
  },
  {
    id: "webinar-data-careers",
    type: "Webinar",
    title: "Breaking Into Data Roles",
    date: "July 18, 2026",
    time: "6:30 PM IST",
    mentor: "Nisha Patel",
    href: "/events/data-careers",
  },
];

const workshops: EventCardData[] = [
  {
    id: "workshop-react",
    type: "Workshop",
    title: "React Dashboard Sprint",
    date: "July 16, 2026",
    time: "7:30 PM IST",
    mentor: "Meera Iyer",
    href: "/events/react-dashboard-sprint",
  },
  {
    id: "workshop-django",
    type: "Workshop",
    title: "Django API Production Basics",
    date: "July 21, 2026",
    time: "8:00 PM IST",
    mentor: "Rahul Verma",
    href: "/events/django-api-production",
  },
];

const exams: EventCardData[] = [
  {
    id: "exam-full-stack",
    type: "Exam",
    title: "Full Stack Certification Exam",
    date: "July 28, 2026",
    certification: "Full Stack Software Engineer",
    href: "/events/full-stack-certification-exam",
  },
  {
    id: "exam-ai",
    type: "Exam",
    title: "AI Track Assessment",
    date: "August 2, 2026",
    certification: "AI Engineer Track",
    href: "/events/ai-track-assessment",
  },
];

const bounties: EventCardData[] = [
  {
    id: "bounty-auth",
    type: "Bounty",
    title: "Build a Secure Auth Flow",
    date: "Closes July 19, 2026",
    prize: "INR 25K",
    href: "/events/secure-auth-bounty",
  },
  {
    id: "bounty-dashboard",
    type: "Bounty",
    title: "Optimize a Slow Analytics Dashboard",
    date: "Closes July 23, 2026",
    prize: "INR 18K",
    href: "/events/dashboard-performance-bounty",
  },
];

const hackathons: EventCardData[] = [
  {
    id: "hackathon-ai-product",
    type: "Hackathon",
    title: "AI Product Weekend",
    date: "July 20-21, 2026",
    meta: "AI Tools",
    prize: "INR 1L",
    teamSize: "2-4 learners",
    deadline: "July 18, 2026",
    href: "/events/ai-product-weekend",
  },
  {
    id: "hackathon-placement",
    type: "Hackathon",
    title: "Placement Tools Hackathon",
    date: "August 3-4, 2026",
    meta: "Career Tech",
    prize: "INR 75K",
    teamSize: "2-3 learners",
    deadline: "August 1, 2026",
    href: "/events/placement-tools-hackathon",
  },
];

const leaderboard = [
  { rank: 1, name: "Aarav M.", score: "980 pts", prize: "INR 12K" },
  { rank: 2, name: "Diya S.", score: "930 pts", prize: "INR 8K" },
  { rank: 3, name: "Kiran P.", score: "880 pts", prize: "INR 5K" },
];

export default function EventsPage() {
  return (
    <>
      <HeroSection className="bg-[#0F172A] py-20 text-white lg:py-24">
        <CenterHero
          badge={
            <span className="inline-flex items-center gap-2 rounded-full border border-[#38A3A5]/30 bg-[#38A3A5]/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#57CC99]">
              <CalendarDays className="size-4" />
              Live Events
            </span>
          }
          title={
            <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Learn, Compete,
              <br />
              <span className="text-[#FF7A0E]">Get Noticed.</span>
            </h1>
          }
          description={
            <p className="text-base leading-relaxed text-[#E9EAF0]">
              Join webinars, workshops, exams, bounties, and hackathons built
              for serious learners moving toward real software careers.
            </p>
          }
        />
        <EventHeroCarousel events={heroEvents} />
      </HeroSection>

      <EventSection className="bg-white">
        <EventCategorySection
          eyebrow="Webinars"
          title="Live sessions with engineers and career mentors."
          description="Short, focused sessions that explain what to learn, why it matters, and how to apply it in real projects."
          bullets={[
            "Career breakdowns from working professionals",
            "Live Q&A for roadmap and interview doubts",
            "Practical takeaways you can apply the same week",
          ]}
          ctaLabel="View All Webinars"
          ctaHref="/events?type=webinar"
          events={webinars}
        />
      </EventSection>

      <EventSection className="bg-[#F9FAFB]">
        <EventCategorySection
          flipped
          eyebrow="Workshops"
          title="Hands-on builds guided by mentors."
          description="Workshops are practical build sessions where you create something useful while learning the patterns behind it."
          bullets={[
            "Code-along product and engineering sessions",
            "Starter files, review prompts, and practice tasks",
            "Focused learning for portfolio-ready outcomes",
          ]}
          ctaLabel="View All Workshops"
          ctaHref="/events?type=workshop"
          events={workshops}
        />
      </EventSection>

      <EventSection className="bg-white">
        <EventCategorySection
          eyebrow="Exams"
          title="Assessment windows tied to certifications."
          description="LearnerSlate exams validate skill milestones and help learners earn verifiable program, track, or course certificates."
          bullets={[
            "Timed assessments mapped to certificate outcomes",
            "Practical questions, coding tasks, and project review",
            "Clear score visibility and retake windows",
          ]}
          ctaLabel="View All Exams"
          ctaHref="/events?type=exam"
          events={exams}
        />
      </EventSection>

      <EventSection className="bg-[#F9FAFB]">
        <Stack gap={32}>
          <EventCategorySection
            eyebrow="Bounties"
            title="Solve real challenges and climb the leaderboard."
            description="Bounties are short competitions where learners submit solutions to practical engineering tasks for prizes and recognition."
            bullets={[
              "Open challenges with clear scoring rubrics",
              "Prize pools for top submissions",
              "Great way to show proof of skill publicly",
            ]}
            ctaLabel="View All Bounties"
            ctaHref="/events?type=bounty"
            events={bounties}
          />
          <BountyLeaderboard entries={leaderboard} href="/leaderboard" />
        </Stack>
      </EventSection>

      <EventSection className="bg-white">
        <EventCategorySection
          flipped
          eyebrow="Hackathons"
          title="Build with a team. Ship under pressure."
          description="Hackathons are weekend-style build events with themes, mentors, judging, prizes, and past winners showcased."
          bullets={[
            "Team sizes from two to four learners",
            "Theme-led builds with mentor checkpoints",
            "Prize pools and public winner showcases",
          ]}
          ctaLabel="View All Hackathons"
          ctaHref="/events?type=hackathon"
          events={hackathons}
        />
      </EventSection>

      <EventSection className="bg-[#F9FAFB]">
        <EventNotifyStrip />
      </EventSection>

      <CTASection className="bg-white py-16 lg:py-20">
        <Box className="rounded-xl border border-[#E9EAF0] bg-[#F9FAFB] px-6 py-12 shadow-[0_24px_70px_rgba(15,23,42,0.06)]">
          <CenterCTA
            title="Ready to Participate?"
            description="Browse upcoming events, register for the right sessions, and join the LearnerSlate community."
            primaryAction={
              <Button asChild size="lg" className="bg-[#FF7A0E] text-white hover:bg-[#E86C0D]">
                <Link href="/events">
                  Browse All Events
                </Link>
              </Button>
            }
            secondaryAction={
              <Button asChild size="lg" variant="outline">
                <Link href="/community">
                  <Users className="size-4" />
                  Join Community
                </Link>
              </Button>
            }
          />
        </Box>
      </CTASection>
    </>
  );
}
