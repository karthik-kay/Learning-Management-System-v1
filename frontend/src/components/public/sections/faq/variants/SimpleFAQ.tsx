import Link from "next/link";
import { MessageCircle } from "lucide-react";

import { Stack, Grid } from "@/components/shared/primitives";
import { FAQAccordion } from "@/components/public/widgets/display/FAQAccordion";

interface FAQ {
  question: string;
  answer: string;
}

interface SimpleFAQSectionProps {
  title: string;
  description: string;
  faqs: FAQ[];
  link?: {
    label: string;
    href: string;
  };
}

export function SimpleFAQSection({
  title,
  description,
  faqs,
  link,
}: SimpleFAQSectionProps) {
  return (
    <Grid gap={64} className="grid-cols-1 lg:grid-cols-2 items-stretch">
      <Stack gap={16} align="start" className="h-full">
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>

        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>

        {link && (
          <Link
            href={link.href}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium w-fit hover:bg-slate-50 transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            {link.label}
          </Link>
        )}
      </Stack>

      <FAQAccordion items={faqs} />
    </Grid>
  );
}
