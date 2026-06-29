import { FAQSection } from "@/components/public/sections/faq/FAQSection";
import { SimpleFAQSection } from "@/components/public/sections/faq/variants/SimpleFAQ";
import { LegalSection } from "@/components/public/sections/legal/LegalSection";
import { LegalDocumentLayout } from "@/components/public/sections/legal/variants/LegalDocumentLayout";
import { LegalArticleSection } from "@/components/public/widgets/legal/LegalArticleSection";
import { LegalCallout } from "@/components/public/widgets/legal/LegalCallout";
import { LegalChecklistPanel } from "@/components/public/widgets/legal/LegalChecklistPanel";
import { LegalContactStrip } from "@/components/public/widgets/legal/LegalContactStrip";
import { LegalFeatureCard } from "@/components/public/widgets/legal/LegalFeatureCard";
import { LegalProcessSteps } from "@/components/public/widgets/legal/LegalProcessSteps";
import { LegalSummaryStrip } from "@/components/public/widgets/legal/LegalSummaryStrip";
import { LegalTimeline } from "@/components/public/widgets/legal/LegalTimeline";
import { Badge } from "@/components/ui/badge";
import { Grid, Inline, Stack } from "@/components/shared/primitives";
import { Mail } from "lucide-react";
import Link from "next/link";

const toc = [
  { id: "eligibility", label: "Eligibility" },
  { id: "request", label: "How to Request" },
  { id: "emi", label: "EMI and Loan Plans" },
  { id: "processing", label: "Processing Time" },
  { id: "special-cases", label: "Special Cases" },
  { id: "faq", label: "FAQ" },
  { id: "contact", label: "Contact" },
];

const summary = [
  { value: "7 Days", label: "Refund window" },
  { value: "20%", label: "Max content completed" },
  { value: "7-15 Days", label: "Refund processing" },
  { value: "3 Business Days", label: "Response to your request" },
];

const qualifies = [
  "Request made within 7 days of enrollment date",
  "Less than 20% of program content completed",
  "No certificate issued yet",
  "Request submitted from your registered email",
  "Payment made directly through LearnerSlate",
];

const notQualified = [
  "After 7 days from enrollment",
  "Completed more than 20% of content",
  "Certificate already issued to you",
  "Account suspended for Terms violation",
  "Enrolled via a partner institution",
  "EMI foreclosure charges governed by EMI provider",
];

const processSteps = [
  {
    title: "Email Us",
    description:
      'Email payments@learnerslate.com from your registered email with the subject "Refund Request - Your Full Name".',
  },
  {
    title: "Include These Details",
    description:
      "Share your enrollment ID, program name, and reason for the refund request.",
  },
  {
    title: "We Respond",
    description:
      "Within 3 business days, we confirm eligibility and initiate the refund if approved.",
  },
];

const timeline = [
  { label: "Day 0", text: "You submit your refund request via email." },
  { label: "Day 1-3", text: "We review and confirm eligibility." },
  { label: "Day 3", text: "Refund is initiated through Razorpay." },
  { label: "Day 7-15", text: "Amount reflects in your account." },
];

const faqs = [
  {
    question: "Can I pause my program instead of getting a refund?",
    answer:
      "Yes. You can pause your program for up to 60 days once per enrollment. Pausing does not reset your 7-day refund window.",
  },
  {
    question: "What if I enrolled through my college?",
    answer:
      "If you enrolled through a partner institution, that institution's refund policy applies. Contact your institution admin directly.",
  },
  {
    question: "I got a refund. Do I lose access immediately?",
    answer:
      "Yes. Once a refund is approved and initiated, access to program content, live sessions, and platform features is revoked.",
  },
  {
    question: "Can I re-enroll after getting a refund?",
    answer:
      "Yes, you can re-enroll anytime. The 7-day refund window starts fresh only for new enrollments, not same-program re-enrollments.",
  },
  {
    question: "What if I miss the 7-day window by a day?",
    answer:
      "We strictly follow the 7-day policy. Exceptional cases can be reviewed by email, but exceptions are not guaranteed.",
  },
];

export default function RefundPolicyPage() {
  return (
    <>
      <section className="bg-[#0F172A] py-20 text-white lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Stack gap={18}>
            <Badge className="w-fit border-[#FF7A0E]/25 bg-[#FF7A0E]/10 text-[#FF7A0E]">
              Refund Policy
            </Badge>
            <Stack gap={10}>
              <h1 className="max-w-3xl text-4xl font-bold tracking-tight lg:text-6xl">
                Simple, Fair, No Surprises.
              </h1>
              <p className="max-w-2xl text-base leading-relaxed text-[#E9EAF0]">
                We want you to enroll with confidence. Here is exactly what
                happens if things do not work out.
              </p>
              <p className="text-sm text-[#8C94A3]">Last updated: June 2026</p>
            </Stack>
            <Inline gap={10} justify="start" wrap>
              <span className="text-sm font-semibold text-[#57CC99]">
                Jump to
              </span>
              {toc.slice(0, 4).map((item) => (
                <Link
                  key={item.id}
                  href={`#${item.id}`}
                  className="text-sm font-medium text-[#E9EAF0] hover:text-[#FF7A0E]"
                >
                  {item.label}
                </Link>
              ))}
            </Inline>
          </Stack>
        </div>
      </section>

      <LegalSummaryStrip items={summary} />

      <LegalSection className="bg-white">
        <LegalDocumentLayout toc={toc}>
          <Stack gap={64}>
            <LegalArticleSection
              id="eligibility"
              number={1}
              title="When You Can Get a Refund"
              accent="orange"
            >
              <Grid className="grid-cols-1 gap-5 lg:grid-cols-[1.1fr_0.9fr]">
                <LegalChecklistPanel
                  title="Who qualifies"
                  items={qualifies}
                  tone="positive"
                />
                <LegalChecklistPanel
                  title="When you cannot"
                  items={notQualified}
                  tone="negative"
                />
              </Grid>
            </LegalArticleSection>

            <LegalArticleSection
              id="request"
              number={2}
              title="How to Request a Refund"
              accent="orange"
            >
              <Stack gap={22}>
                <p className="text-center text-sm text-[#6B7280]">
                  Takes less than 5 minutes.
                </p>
                <LegalProcessSteps steps={processSteps} />
                <LegalCallout tone="orange">
                  <Inline gap={10} justify="start">
                    <Mail className="size-4 text-[#E86C0D]" />
                    <span className="font-bold">payments@learnerslate.com</span>
                    <span className="text-[#6B7280]">
                      Response within 3 business days
                    </span>
                  </Inline>
                </LegalCallout>
              </Stack>
            </LegalArticleSection>

            <LegalArticleSection
              id="emi"
              number={3}
              title="What Happens If You Paid via EMI?"
              accent="orange"
            >
              <Grid className="grid-cols-1 gap-5 md:grid-cols-2">
                <LegalFeatureCard title="EMI via Razorpay" dark>
                  <ul className="list-disc space-y-2 pl-5">
                    <li>Eligible refunds return amount paid to date.</li>
                    <li>Foreclosure charges are set by your bank or provider.</li>
                    <li>Future EMI payments are cancelled on approval.</li>
                    <li>Processing usually takes 10-15 business days.</li>
                  </ul>
                </LegalFeatureCard>
                <LegalFeatureCard title="Education Loan" dark>
                  <ul className="list-disc space-y-2 pl-5">
                    <li>Refund is credited back to the loan account.</li>
                    <li>Loan closure is handled with your provider.</li>
                    <li>We can provide a refund confirmation letter if needed.</li>
                    <li>Contact payments@learnerslate.com for help.</li>
                  </ul>
                </LegalFeatureCard>
              </Grid>
            </LegalArticleSection>

            <LegalArticleSection
              id="processing"
              number={4}
              title="How Long Does It Take?"
              accent="orange"
            >
              <Stack gap={22}>
                <LegalTimeline items={timeline} />
                <p className="mx-auto max-w-2xl text-sm leading-6 text-[#6B7280]">
                  Processing times may vary depending on your bank or payment
                  provider. You will receive an email confirmation once the
                  refund is initiated.
                </p>
              </Stack>
            </LegalArticleSection>

            <LegalArticleSection
              id="special-cases"
              number={5}
              title="A Few Special Situations"
              accent="orange"
            >
              <Grid className="grid-cols-1 gap-5 md:grid-cols-3">
                <LegalFeatureCard title="If We Cancel a Program" icon="No">
                  If LearnerSlate cancels your program before it begins, you
                  receive a full refund within 10 business days.
                </LegalFeatureCard>
                <LegalFeatureCard title="If We Change the Program" icon="!">
                  If major changes materially affect content or delivery, you
                  can request a refund within 7 days of being notified.
                </LegalFeatureCard>
                <LegalFeatureCard title="Technical or Billing Errors" icon="Fix">
                  Incorrect charges or payment errors are resolved on priority,
                  usually within 2 business days.
                </LegalFeatureCard>
              </Grid>
            </LegalArticleSection>

            <section id="faq" className="scroll-mt-28">
              <FAQSection className="py-0">
                <SimpleFAQSection
                  title="Refund FAQ"
                  description="Clear answers to common refund and access questions."
                  faqs={faqs}
                />
              </FAQSection>
            </section>
          </Stack>
        </LegalDocumentLayout>
      </LegalSection>

      <div id="contact" className="scroll-mt-28">
        <LegalContactStrip />
      </div>
    </>
  );
}
