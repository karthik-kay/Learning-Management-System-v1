import { ArrowUpRight, BriefcaseBusiness } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { PublicRelatedCareerPathData } from "../roadmapData";

interface RelatedCareerPathsProps {
  careers?: PublicRelatedCareerPathData[];
  roadmapDomain: string;
}

export function RelatedCareerPaths({
  careers,
  roadmapDomain,
}: RelatedCareerPathsProps) {
  return (
    <section className="bg-white py-20">
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#38A3A5]">
            Career paths
          </p>
          <h2 className="mt-3 text-3xl font-black text-[#0F172A] md:text-4xl">
            Roles this roadmap can point toward
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6B7280]">
            Roadmaps teach the domain. Career paths explain the job outcomes,
            salary bands, demand, and role expectations.
          </p>
        </div>
        <Button
          asChild
          variant="outline"
          className="border-[#E9EAF0] bg-white text-[#0F172A] hover:bg-[#F9FAFB]"
        >
          <Link href="/career-path">
            View all careers
            <ArrowUpRight className="size-4" />
          </Link>
        </Button>
      </div>

      {careers?.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {careers.slice(0, 3).map((career) => (
            <article
              key={career.slug}
              className="rounded-2xl border border-[#E9EAF0] bg-[#F9FAFB] p-6"
            >
              <div className="flex size-11 items-center justify-center rounded-2xl bg-[#0F172A] text-white">
                <BriefcaseBusiness className="size-5" />
              </div>
              <p className="mt-5 text-xs font-bold uppercase tracking-[0.14em] text-[#38A3A5]">
                {career.roleFamily}
              </p>
              <h3 className="mt-2 text-xl font-black text-[#0F172A]">
                {career.title}
              </h3>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <Mini label="Salary" value={career.salary} />
                <Mini label="Demand" value={career.demand || "Growing"} />
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {career.skills.slice(0, 4).map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-white px-3 py-1 text-xs font-bold text-[#22577A]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              <Button
                asChild
                className="mt-6 w-full bg-[#0F172A] text-white hover:bg-[#1E293B]"
              >
                <Link href={`/career-path/${career.slug}`}>
                  Open career path
                  <ArrowUpRight className="size-4" />
                </Link>
              </Button>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-[#E9EAF0] bg-[#F9FAFB] p-8">
          <p className="text-lg font-black text-[#0F172A]">
            {roadmapDomain} career paths are being linked.
          </p>
          <p className="mt-2 text-sm leading-6 text-[#6B7280]">
            This roadmap can still be followed now. Once the career content is
            linked in the backend, this section will show related roles.
          </p>
        </div>
      )}
    </section>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white p-4">
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#8C94A3]">
        {label}
      </p>
      <p className="mt-1 text-sm font-black text-[#0F172A]">{value}</p>
    </div>
  );
}
