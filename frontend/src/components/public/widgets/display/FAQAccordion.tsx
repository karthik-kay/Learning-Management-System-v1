import { Accordion } from "@/components/ui/accordion";
import { FAQItem } from "./FAQItem";

interface FAQ {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQ[];
}

export function FAQAccordion({ items }: FAQAccordionProps) {
  return (
    <Accordion type="single" collapsible>
      {items.map((item) => (
        <FAQItem
          key={item.question}
          question={item.question}
          answer={item.answer}
        />
      ))}
    </Accordion>
  );
}
