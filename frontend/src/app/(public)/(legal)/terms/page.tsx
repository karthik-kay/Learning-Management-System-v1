import { LegalSection } from "@/components/public/sections/legal/LegalSection";
import { LegalDocumentLayout } from "@/components/public/sections/legal/variants/LegalDocumentLayout";
import { LegalArticleSection } from "@/components/public/widgets/legal/LegalArticleSection";
import { LegalCallout } from "@/components/public/widgets/legal/LegalCallout";
import { Badge } from "@/components/ui/badge";
import { Box, Grid, Stack } from "@/components/shared/primitives";

const toc = [
  { id: "acceptance", label: "Acceptance of Terms" },
  { id: "eligibility", label: "Eligibility" },
  { id: "programs", label: "Programs and Enrollment" },
  { id: "payments", label: "Payment Terms" },
  { id: "responsibilities", label: "Student Responsibilities" },
  { id: "ip", label: "Intellectual Property" },
  { id: "placement", label: "Placement Support" },
  { id: "certificates", label: "Certificates" },
  { id: "liability", label: "Limitation of Liability" },
  { id: "termination", label: "Termination" },
  { id: "law", label: "Governing Law" },
  { id: "changes", label: "Changes to Terms" },
  { id: "contact", label: "Contact Information" },
];

export default function TermsPage() {
  return (
    <>
      <section className="bg-[#0B1220] py-20 text-white lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Stack gap={14}>
            <Badge className="w-fit border-orange-500/30 bg-orange-500/10 text-orange-300">
              Legal and Compliance
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
              Terms of Service
            </h1>
            <p className="text-sm text-slate-400">Last updated: June 2026</p>
          </Stack>
        </div>
      </section>

      <LegalSection className="bg-slate-50">
        <LegalDocumentLayout toc={toc}>
          <Stack gap={56}>
            <LegalArticleSection id="acceptance" number={1} title="Acceptance of Terms">
              <p>
                By accessing or using the LearnerSlate platform, including any
                subdomains and mobile experiences, you agree to be bound by
                these Terms of Service. If you do not agree, please do not use
                our services.
              </p>
            </LegalArticleSection>

            <LegalArticleSection id="eligibility" number={2} title="Eligibility">
              <LegalCallout tone="orange">
                <ul className="list-disc space-y-2 pl-5">
                  <li>You must be at least 16 years old to register.</li>
                  <li>Registration information must be accurate and truthful.</li>
                  <li>You are responsible for securing your account activity.</li>
                </ul>
              </LegalCallout>
            </LegalArticleSection>

            <LegalArticleSection id="programs" number={3} title="Programs and Enrollment">
              <p>
                Enrollment in a LearnerSlate program is confirmed after
                successful payment processing. Access to course content is
                typically granted for the duration of the selected cohort plus
                any revision period stated in program-specific documentation.
              </p>
            </LegalArticleSection>

            <LegalArticleSection id="payments" number={4} title="Payment Terms">
              <LegalCallout title="Pricing and Processing">
                All prices are listed in Indian Rupees unless mentioned
                otherwise. We use trusted payment processors for secure payment
                collection.
              </LegalCallout>
              <p>
                For EMI plans, you are entering a financial agreement with the
                relevant financing partner. LearnerSlate is not responsible for
                interest rates, late fees, or credit impacts from EMI defaults.
              </p>
            </LegalArticleSection>

            <LegalArticleSection id="responsibilities" number={5} title="Student Responsibilities">
              <p>As a LearnerSlate student, you agree to follow the code of conduct.</p>
              <ul className="space-y-4">
                <li>
                  <strong>Academic honesty:</strong> projects and assignments
                  must be your own work.
                </li>
                <li>
                  <strong>No redistribution:</strong> do not share, record, or
                  distribute course materials to non-enrolled users.
                </li>
                <li>
                  <strong>Community respect:</strong> maintain professional
                  behavior in live sessions and community channels.
                </li>
              </ul>
            </LegalArticleSection>

            <LegalArticleSection id="ip" number={6} title="Intellectual Property">
              <p>
                All curriculum, videos, code snippets, and design assets
                provided by LearnerSlate are owned by LearnerSlate or its
                licensors. Access is limited, personal, and non-transferable.
              </p>
              <LegalCallout tone="orange">
                Your original projects and code created during the program
                remain yours.
              </LegalCallout>
            </LegalArticleSection>

            <LegalArticleSection id="placement" number={7} title="Placement Support">
              <p>
                Placement support is provided on a best-effort basis. We may
                provide resume reviews, mock interviews, and hiring connections,
                but we do not guarantee a job placement or salary bracket.
              </p>
            </LegalArticleSection>

            <LegalArticleSection id="certificates" number={8} title="Certificates">
              <p>
                Certificates are issued after completion requirements are met,
                including minimum content progress, mandatory assessments, and
                capstone submissions where applicable.
              </p>
            </LegalArticleSection>

            <LegalArticleSection id="liability" number={9} title="Limitation of Liability">
              <LegalCallout>
                To the maximum extent permitted by law, LearnerSlate shall not
                be liable for indirect, incidental, or consequential damages.
              </LegalCallout>
            </LegalArticleSection>

            <LegalArticleSection id="termination" number={10} title="Termination">
              <p>
                We may suspend or terminate access if your account violates
                these terms, platform safety policies, or intellectual property
                restrictions.
              </p>
            </LegalArticleSection>

            <LegalArticleSection id="law" number={11} title="Governing Law">
              <p>
                These terms are governed by the laws of India. Disputes shall
                be subject to the courts of Bangalore, Karnataka.
              </p>
            </LegalArticleSection>

            <LegalArticleSection id="changes" number={12} title="Changes to Terms">
              <p>
                We may update these terms periodically. Significant changes will
                be notified through your registered email or a prominent
                platform notice.
              </p>
            </LegalArticleSection>

            <Box className="h-px bg-slate-200" />

            <LegalArticleSection id="contact" number={13} title="Contact Information">
              <Grid className="grid-cols-1 gap-8 sm:grid-cols-2">
                <Stack gap={3}>
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    Legal Inquiries
                  </span>
                  <span className="font-bold text-orange-600">
                    legal@learnerslate.com
                  </span>
                </Stack>
                <Stack gap={3}>
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    Corporate Address
                  </span>
                  <span>
                    LearnerSlate EdTech Pvt. Ltd., Bangalore, Karnataka, India
                  </span>
                </Stack>
              </Grid>
            </LegalArticleSection>
          </Stack>
        </LegalDocumentLayout>
      </LegalSection>
    </>
  );
}
