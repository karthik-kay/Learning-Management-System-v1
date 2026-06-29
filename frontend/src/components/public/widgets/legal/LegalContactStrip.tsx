import { Grid, Stack } from "@/components/shared/primitives";
import { Mail, MessageCircle } from "lucide-react";

export function LegalContactStrip() {
  return (
    <section className="bg-[#0F172A] py-14 text-white">
      <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <Stack gap={28} align="center">
          <Stack gap={8} align="center">
            <h2 className="text-3xl font-bold tracking-tight">
              Still Have Questions?
            </h2>
            <p className="text-sm leading-6 text-[#E9EAF0]">
              Our support team is here to help.
            </p>
          </Stack>

          <Grid className="w-full grid-cols-1 gap-4 md:grid-cols-2">
            <ContactCard
              icon={<Mail className="size-5" />}
              title="Email"
              value="payments@learnerslate.com"
              note="For refund requests"
            />
            <ContactCard
              icon={<MessageCircle className="size-5" />}
              title="Support"
              value="support@learnerslate.com"
              note="For general queries"
            />
          </Grid>

          <p className="text-xs font-medium text-[#8C94A3]">
            Response within 3 business days
          </p>
        </Stack>
      </div>
    </section>
  );
}

function ContactCard({
  icon,
  title,
  value,
  note,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  note: string;
}) {
  return (
    <Stack
      gap={8}
      align="center"
      className="rounded-xl border border-white/10 bg-white/[0.04] p-6"
    >
      <span className="text-[#57CC99]">{icon}</span>
      <span className="text-sm font-bold uppercase tracking-widest text-[#8C94A3]">
        {title}
      </span>
      <span className="font-bold text-white">{value}</span>
      <span className="text-sm text-[#E9EAF0]">{note}</span>
    </Stack>
  );
}
