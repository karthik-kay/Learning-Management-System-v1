import { SingleColumnDetailLayout } from "@/components/public/layouts/SingleColumnDetailLayout";
import { ContactSection } from "@/components/public/sections/contact/ContactSection";
import { ContactAudience } from "@/components/public/sections/contact/variants/ContactAudienceSection";
import { ContactMethods } from "@/components/public/sections/contact/variants/ContactMethods";
import { CTASection } from "@/components/public/sections/cta/CTASection";
import CenterCTA from "@/components/public/sections/cta/variants/CenterCTA";
import { FAQSection } from "@/components/public/sections/faq/FAQSection";
import { SimpleFAQSection } from "@/components/public/sections/faq/variants/SimpleFAQ";
import { FormSection } from "@/components/public/sections/form/FormSection";
import { HeroSection } from "@/components/public/sections/hero/HeroSection";
import { CenterHero } from "@/components/public/sections/hero/variants/CenterHero";
import { PeopleSection } from "@/components/public/sections/people/PeopleSection";
import {
  ContactLeadsSection,
  Lead,
} from "@/components/public/sections/people/variants/ContactLeadSection";
import { VerticalTimeline } from "@/components/public/sections/timeline/variants/VerticalTimeline";
import { AudienceCard } from "@/components/public/widgets/cards/AudienceCard";
import { ContactCard } from "@/components/public/widgets/cards/ContactCard";
import { LogoChip } from "@/components/public/widgets/display/LogoChip";
import { TimelineItem } from "@/components/public/widgets/display/TimelineItem";
import { ContactForm } from "@/components/public/widgets/forms/ContactForm";
import { Box, Grid, Inline } from "@/components/shared/primitives";
import { Button } from "@/components/ui/button";
import { Building2, GraduationCap, LifeBuoy, Mail, Users } from "lucide-react";
import Link from "next/link";

const leads: Lead[] = [
  {
    image: "/mentors/mentor_1.jpg",
    name: "Sarah Johnson",
    jobTitle: "Admissions Lead",
    jobDescription: "Helps learners choose the right programs.",
  },
  {
    image: "/mentors/mentor_2.jpg",
    name: "Michael Chen",
    jobTitle: "Partnerships Lead",
    jobDescription: "Supports organizational partnerships.",
  },
  {
    image: "/mentors/mentor_3.jpg",
    name: "Priya Patel",
    jobTitle: "Learner Success Lead",
    jobDescription: "Supports learners throughout their journey.",
  },
];

const contactFaqs = [
  {
    question: "How quickly will I receive a response?",
    answer:
      "Our team typically responds to inquiries within 24-48 business hours.",
  },
  {
    question: "Can I schedule a demo before enrolling?",
    answer: "Yes, you can request a demo session through our contact form.",
  },
  {
    question: "Who should I contact for partnership opportunities?",
    answer:
      "Use the partnership inquiry form or reach out to our partnerships team.",
  },
  {
    question: "Do you provide support for parents?",
    answer:
      "Yes, we have dedicated support channels for parents and guardians.",
  },
];

export default function ContactPage() {
  return (
    <SingleColumnDetailLayout>
      {/* Hero — 64px vertical padding, light slate bg matching image */}
      <HeroSection className="py-16 bg-slate-50">
        <CenterHero
          badge={
            <Box className="bg-blue-300 text-blue-600 text- rounded-lg py-1 px-2">
              <p>CONTACT OUR TEAM</p>
            </Box>
          }
          title={
            <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold tracking-tight leading-tight">
              Lets Build a Future of Learning Together
            </h1>
          }
          description={
            <p className="max-w-lg text-base text-muted-foreground leading-relaxed">
              Whether you're a student seeking support, a mentor looking to
              inspire, or a partner aiming for impact. Our team is here to
              support your journey.
            </p>
          }
          actions={
            <Inline gap={12} justify="center" className="flex-col sm:flex-row">
              <Button
                size="lg"
                className="px-6 bg-orange-500 hover:bg-orange-600 text-white"
              >
                COntact Support
              </Button>
              <Button variant="outline" size="lg" className="px-6">
                Explore PartnerShips
              </Button>
            </Inline>
          }
          stats={
            <Inline
              gap={0}
              justify="center"
              align="center"
              className="flex-wrap divide-x divide-border"
            >
              <Box className="px-8 py-2 text-center">
                <p className="text-2xl font-bold tabular-nums text-orange-500">
                  24 hrs
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground tracking-wide uppercase">
                  Avg. response time
                </p>
              </Box>

              <Box className="px-8 py-2 text-center">
                <p className="text-2xl font-bold tabular-nums text-orange-500">
                  6 days
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground tracking-wide uppercase">
                  Support availability
                </p>
              </Box>

              <Box className="px-8 py-2 text-center">
                <p className="text-2xl font-bold tabular-nums text-orange-500">
                  15k+
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground tracking-wide uppercase">
                  Students supported
                </p>
              </Box>
            </Inline>
          }
        />
      </HeroSection>

      {/* Contact method cards — 48px vertical padding, slate bg */}
      <ContactSection className="py-12 bg-slate-50">
        <ContactMethods>
          <ContactCard
            icon={<Mail className="h-5 w-5 text-orange-500" />}
            title={<h3 className="text-base font-semibold">Admissions</h3>}
            description={
              <p className="text-sm text-muted-foreground leading-relaxed">
                Questions about programs, enrollment and admissions.
              </p>
            }
            action={
              <Button
                variant="link"
                className="h-auto p-0 text-sm text-orange-500"
              >
                admissions@learnerslate.com
              </Button>
            }
          />

          <ContactCard
            icon={<LifeBuoy className="h-5 w-5 text-orange-500" />}
            title={<h3 className="text-base font-semibold">Student Support</h3>}
            description={
              <p className="text-sm text-muted-foreground leading-relaxed">
                Need help with your account, payments or the learning platform.
              </p>
            }
            action={
              <Button
                variant="link"
                className="h-auto p-0 text-sm text-orange-500"
              >
                support@learnerslate.com
              </Button>
            }
          />

          <ContactCard
            icon={<Building2 className="h-5 w-5 text-orange-500" />}
            title={<h3 className="text-base font-semibold">Partnerships</h3>}
            description={
              <p className="text-sm text-muted-foreground leading-relaxed">
                Collaborate with us as an institution or hiring partner.
              </p>
            }
            action={
              <Button
                variant="link"
                className="h-auto p-0 text-sm text-orange-500"
              >
                partnerships@learnerslate.com
              </Button>
            }
          />

          <ContactCard
            icon={<Users className="h-5 w-5 text-orange-500" />}
            title={<h3 className="text-base font-semibold">Mentors</h3>}
            description={
              <p className="text-sm text-muted-foreground leading-relaxed">
                Join our mentor network or inquire about teaching opportunities.
              </p>
            }
            action={
              <Button
                variant="link"
                className="h-auto p-0 text-sm text-orange-500"
              >
                mentors@learnerslate.com
              </Button>
            }
          />
        </ContactMethods>
      </ContactSection>

      {/* Audience selector — 64px vertical padding, white bg */}
      <ContactSection
        className="py-16 bg-white"
        title={<Box>Who Should Contact Us?</Box>}
        description={
          <Box>
            We&apos;re here to help students, parents, mentors, and hiring
            partners.
          </Box>
        }
        actions={<Button>Contact Support</Button>}
      >
        <ContactAudience>
          <AudienceCard
            icon={<GraduationCap size={18} className="text-orange-500" />}
            title={<h3 className="font-semibold text-sm">Student / Learner</h3>}
            description={
              <p className="text-sm text-muted-foreground">
                Course guidance, enrollment support, certificate requests,
                technical help, and progress discussions.
              </p>
            }
            features={
              <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                <p>✓ Enrollment assistance</p>
                <p>✓ Course technical support</p>
                <p>✓ Certificates & requests</p>
              </div>
            }
            actions={
              <button className="w-full rounded-xl bg-orange-500 hover:bg-orange-600 px-4 py-3 text-white text-sm font-medium transition-colors">
                Contact Support
              </button>
            }
          />

          <AudienceCard
            icon={<Building2 size={18} className="text-orange-500" />}
            title={
              <h3 className="font-semibold text-sm">Corporate / Partner</h3>
            }
            description={
              <p className="text-sm text-muted-foreground">
                Explore partnerships, bulk licensing, custom curriculum design
                and enterprise API integrations.
              </p>
            }
            features={
              <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                <p>✓ Bulk seat licensing</p>
                <p>✓ Custom curriculum design</p>
                <p>✓ Enterprise API & SSO</p>
              </div>
            }
            actions={
              <button className="w-full rounded-xl border border-border hover:bg-slate-50 px-4 py-3 text-sm font-medium transition-colors">
                Explore Partnerships
              </button>
            }
          />

          <AudienceCard
            icon={<Users size={18} className="text-orange-500" />}
            title={<h3 className="font-semibold text-sm">Mentor / Educator</h3>}
            description={
              <p className="text-sm text-muted-foreground">
                Join our expert mentor network, co-author courses, set your
                schedule and earn through knowledge sharing.
              </p>
            }
            features={
              <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                <p>✓ Mentor onboarding</p>
                <p>✓ Co-authoring programs</p>
                <p>✓ Revenue sharing setup</p>
              </div>
            }
            actions={
              <button className="w-full rounded-xl border border-border hover:bg-slate-50 px-4 py-3 text-sm font-medium transition-colors">
                Become A Mentor
              </button>
            }
          />
        </ContactAudience>
      </ContactSection>

      {/* Form + Timeline — dark section, 80px vertical padding */}
      <FormSection className="bg-[#2C2C2C] text-white py-20 px-32">
        <Grid className="grid-cols-1 lg:grid-cols-2" gap={64}>
          <ContactForm />

          <VerticalTimeline>
            <TimelineItem
              label="instantaneous"
              title="Review"
              description="We review your enquiry."
            />
            <TimelineItem
              label="2–3 min"
              title="Assign"
              description="We route it to the right team."
            />
            <TimelineItem
              label="2–3 working days"
              title="Respond"
              description="You'll hear back shortly."
            />
          </VerticalTimeline>
        </Grid>
      </FormSection>

      {/* Meet our leads — 48px vertical padding, white bg */}
      <PeopleSection className="py-12 bg-white">
        <ContactLeadsSection leads={leads} />
      </PeopleSection>

      {/* FAQ — 48px vertical padding, slate bg */}
      <FAQSection className="py-12 bg-slate-50">
        <SimpleFAQSection
          title="Frequently Asked Questions"
          description="Find answers to common questions about contacting LearnerSlate."
          link={{
            label: "View all FAQs",
            href: "/faq",
          }}
          faqs={contactFaqs}
        />
      </FAQSection>

      {/* Bottom CTA — dark navy bg, 64px vertical padding */}

      <CTASection className="py-16 px-6 ">
        <div className="bg-[#0F172A]  border border-white/10 rounded-3xl px-8 py-14 text-center">
          <CenterCTA
            title={
              <span className=" text-white text-3xl lg:text-4xl font-bold">
                Still Have Questions?
              </span>
            }
            description={
              <span className="text-slate-400 text-base">
                Take our 2-minute career assessment to find your ideal learning
                path.
              </span>
            }
            primaryAction={
              <Button asChild size="lg">
                <Link href="/practice">Take a Assessment</Link>
              </Button>
            }
            secondaryAction={
              <Button
                variant="outline"
                asChild
                className="border-white/20 text-black  hover:bg-white/10 hover:text-white"
              >
                <Link href="/faq">Browse FAQs</Link>
              </Button>
            }
          />
        </div>
      </CTASection>
    </SingleColumnDetailLayout>
  );
}
