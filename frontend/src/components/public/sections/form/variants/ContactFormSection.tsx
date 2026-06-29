import { Grid, Stack } from "@/components/shared/primitives";

import { ContactForm } from "@/components/public/widgets/forms/ContactForm";

import { VerticalTimeline } from "@/components/public/sections/timeline/variants/VerticalTimeline";
import { TimelineItem } from "@/components/public/widgets/display/TimelineItem";

import { CheckCircle2 } from "lucide-react";

export function ContactFormSection() {
  return (
    <section>
      <Grid
        className="
          grid-cols-1
          lg:grid-cols-2
          gap-16
          items-start
        "
      >
        <ContactForm />

        <Stack gap={48}>
          <Stack gap={24}>
            <Stack gap={12}>
              <p className="text-xs font-semibold uppercase tracking-widest text-orange-500">
                What happens next
              </p>

              <h2 className="text-3xl font-bold tracking-tight">
                Our response flow
              </h2>
            </Stack>

            <VerticalTimeline>
              <TimelineItem
                label="Step 1 — Instant"
                title="Inquiry received"
                description="Your message lands securely in our encrypted intake system."
              />

              <TimelineItem
                label="Step 2 — <2 minutes"
                title="AI triage & routing"
                description="Our NLP engine routes your message to the correct specialist team."
              />

              <TimelineItem
                label="Step 3 — <24 hours"
                title="Human response"
                description="You receive a thoughtful, human-authored reply — not a template."
              />
            </VerticalTimeline>
          </Stack>

          <div className="rounded-2xl border bg-muted/40 p-6">
            <Stack gap={16}>
              <p className="text-xs font-semibold uppercase tracking-widest">
                Our Promise
              </p>

              <Stack gap={12}>
                {[
                  "Every message read by a real human",
                  "GDPR-compliant data handling",
                  "Zero cold calls without consent",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-teal-500" />
                    <p className="text-sm">{item}</p>
                  </div>
                ))}
              </Stack>
            </Stack>
          </div>
        </Stack>
      </Grid>
    </section>
  );
}
