import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PublicRoadmapDetailData } from "../roadmapData";

interface RoadmapFAQSectionProps {
  roadmap: PublicRoadmapDetailData;
}

const fallbackFaqs = [
  {
    question: "How long does it take?",
    answer:
      "Most learners follow this roadmap at a steady pace over the listed duration, but it can be faster or slower depending on weekly commitment.",
  },
  {
    question: "Do I need prior experience?",
    answer:
      "Beginner-friendly paths start from fundamentals. Intermediate paths expect some comfort with coding basics.",
  },
  {
    question: "What job roles can I get?",
    answer:
      "Use the related career paths section to compare the roles, salary signals, and skill expectations connected to this roadmap.",
  },
];

export function RoadmapFAQSection({ roadmap }: RoadmapFAQSectionProps) {
  const faqs = roadmap.faqs.length ? roadmap.faqs : fallbackFaqs;

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#38A3A5]">
            FAQ
          </p>
          <h2 className="mt-3 text-3xl font-black text-[#0F172A] md:text-4xl">
            Questions before you start
          </h2>
        </div>

        <Accordion type="single" collapsible className="mt-8 space-y-3">
          {faqs.slice(0, 7).map((faq, index) => (
            <AccordionItem
              key={faq.question}
              value={`item-${index}`}
              className="rounded-2xl border border-[#E9EAF0] bg-[#F9FAFB] px-5"
            >
              <AccordionTrigger className="text-left font-black text-[#0F172A] hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-6 text-[#6B7280]">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
