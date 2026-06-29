import { CTASection } from "@/components/public/sections/cta/CTASection";
import CenterCTA from "@/components/public/sections/cta/variants/CenterCTA";
import { LegalSection } from "@/components/public/sections/legal/LegalSection";
import { LegalDocumentLayout } from "@/components/public/sections/legal/variants/LegalDocumentLayout";
import { LegalArticleSection } from "@/components/public/widgets/legal/LegalArticleSection";
import { LegalCallout } from "@/components/public/widgets/legal/LegalCallout";
import { LegalInfoGrid } from "@/components/public/widgets/legal/LegalInfoGrid";
import { LegalTagList } from "@/components/public/widgets/legal/LegalTagList";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Stack } from "@/components/shared/primitives";
import Link from "next/link";

const toc = [
  { id: "who", label: "Who We Are" },
  { id: "collect", label: "What Data We Collect" },
  { id: "use", label: "How We Use Data" },
  { id: "share", label: "Who We Share Data With" },
  { id: "security", label: "Storage and Security" },
  { id: "rights", label: "Your Rights" },
  { id: "cookies", label: "Cookies" },
  { id: "children", label: "Children's Privacy" },
  { id: "changes", label: "Changes to Policy" },
  { id: "contact", label: "Contact Information" },
];

const dataItems = [
  { label: "Account data", text: "Name, email, phone number." },
  { label: "Payment data", text: "Securely processed by Razorpay." },
  { label: "Profile data", text: "Education history and resume details." },
  { label: "Usage data", text: "Log data and device information." },
  { label: "Program data", text: "Course progress and assessment scores." },
  { label: "Communication", text: "Your queries, support requests, and feedback." },
];

export default function PrivacyPage() {
  return (
    <>
      <section className="bg-[#0B1220] py-20 text-center text-white lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Stack gap={14} align="center">
            <Badge className="border-orange-500/30 bg-orange-500/10 text-orange-300">
              Legal and Privacy
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
              Privacy Policy
            </h1>
            <p className="text-sm text-slate-400">
              Last updated: June 2026. Your privacy is our priority at
              LearnerSlate.
            </p>
          </Stack>
        </div>
      </section>

      <LegalSection className="bg-white">
        <LegalDocumentLayout toc={toc}>
          <Stack gap={50}>
            <LegalArticleSection id="who" number={1} title="Who We Are" accent="teal">
              <p>
                LearnerSlate is dedicated to empowering Indian engineers
                through specialized programs and career mentorship. Our mission
                is to bridge the gap between academic learning and industry
                performance.
              </p>
            </LegalArticleSection>

            <LegalArticleSection id="collect" number={2} title="What Data We Collect" accent="teal">
              <LegalInfoGrid items={dataItems} />
            </LegalArticleSection>

            <LegalArticleSection id="use" number={3} title="How We Use Your Data" accent="teal">
              <p>We process your information for the following core purposes:</p>
              <ul className="list-disc space-y-2 pl-5 marker:text-orange-500">
                <li>Account management and authentication.</li>
                <li>Delivering educational content and assessments.</li>
                <li>Processing secure payments and subscriptions.</li>
                <li>Matching you with industry-specific mentors.</li>
                <li>Facilitating placement support and job opportunities.</li>
                <li>Improving platform analytics and learner experience.</li>
              </ul>
            </LegalArticleSection>

            <LegalArticleSection id="share" number={4} title="Who We Share Data With" accent="teal">
              <p>
                We do not sell your personal data. We may share limited
                information with trusted partners to provide essential services.
              </p>
              <LegalTagList
                tags={[
                  "Razorpay",
                  "MSG91",
                  "Google Analytics",
                  "Industry Mentors",
                  "Hiring Institutions",
                ]}
              />
            </LegalArticleSection>

            <LegalArticleSection id="security" number={5} title="Data Storage and Security" accent="teal">
              <p>We use industry-standard controls to protect your data.</p>
              <ul className="list-disc space-y-2 pl-5 marker:text-orange-500">
                <li>Primary servers are hosted securely in India.</li>
                <li>HTTPS encryption is used for data in transit.</li>
                <li>Sensitive credentials are hashed with modern algorithms.</li>
                <li>Internal security audits are conducted periodically.</li>
              </ul>
            </LegalArticleSection>

            <LegalArticleSection id="rights" number={6} title="Your Rights" accent="teal">
              <LegalCallout tone="teal">
                You may request access, correction, deletion, withdrawal of
                consent, or portability of your personal data where applicable
                under law.
              </LegalCallout>
            </LegalArticleSection>

            <LegalArticleSection id="cookies" number={7} title="Cookies" accent="teal">
              <p>
                We use cookies to enhance browsing, remember preferences, and
                understand platform usage. You can manage cookie preferences
                through your browser settings.
              </p>
            </LegalArticleSection>

            <LegalArticleSection id="children" number={8} title="Children" accent="teal">
              <p>
                LearnerSlate programs are intended for users aged 16 and above.
                We do not knowingly collect personal data from children below
                this threshold.
              </p>
            </LegalArticleSection>

            <LegalArticleSection id="changes" number={9} title="Changes to This Policy" accent="teal">
              <p>
                We may update this policy to reflect operational, legal, or
                product changes. Significant updates will be communicated via
                email or a clear platform notice.
              </p>
            </LegalArticleSection>

            <LegalArticleSection id="contact" number={10} title="Contact" accent="teal">
              <p>
                For privacy-related inquiries or to exercise your rights,
                contact our privacy team.
              </p>
              <div className="inline-flex rounded-lg bg-slate-100 px-5 py-4 font-bold text-teal-700">
                privacy@learnerslate.com
              </div>
            </LegalArticleSection>
          </Stack>
        </LegalDocumentLayout>
      </LegalSection>

      <CTASection className="bg-slate-50 py-16 lg:py-20">
        <CenterCTA
          title="Questions About Your Data?"
          description="Our privacy team is here to help you understand your rights and how your information is handled."
          primaryAction={
            <Button asChild variant="outline" size="lg">
              <Link href="mailto:privacy@learnerslate.com">
                Email Privacy Team
              </Link>
            </Button>
          }
        />
      </CTASection>
    </>
  );
}
