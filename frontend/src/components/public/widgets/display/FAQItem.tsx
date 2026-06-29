import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Plus } from "lucide-react";

interface FAQItemProps {
  question: string;
  answer: string;
}

export function FAQItem({ question, answer }: FAQItemProps) {
  return (
    <AccordionItem
      value={question}
      className="mb-3 rounded-xl border border-border bg-white px-5 last:mb-0 [&:last-child]:border-b"
    >
      <AccordionTrigger className="py-4 text-sm font-semibold hover:no-underline [&>svg]:hidden">
        <span>{question}</span>
        <Plus className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-45" />
      </AccordionTrigger>

      <AccordionContent className="pb-4 text-sm text-muted-foreground leading-relaxed">
        {answer}
      </AccordionContent>
    </AccordionItem>
  );
}
