import { ArrowRight, MessageCircle } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

interface RoadmapCTASectionProps {
  title: string;
}

export function RoadmapCTASection({ title }: RoadmapCTASectionProps) {
  return (
    <section className="py-20">
      <div className="rounded-3xl bg-[#0F172A] p-8 text-center text-white md:p-12">
        <h2 className="text-3xl font-black md:text-4xl">
          Start the {title} roadmap
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[#E9EAF0] md:text-base">
          Follow the path independently or connect it with a LearnerSlate
          program for mentorship, projects, and structured reviews.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild className="bg-[#FF7A0E] text-white hover:bg-[#E86C0D]">
            <Link href="/programs">
              Start this roadmap
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
          >
            <Link href="/contact">
              Talk to a counsellor
              <MessageCircle className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
