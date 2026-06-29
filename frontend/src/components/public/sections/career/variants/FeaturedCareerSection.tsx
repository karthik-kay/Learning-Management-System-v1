import { Badge } from "@/components/ui/badge";
import { Grid, Inline, Stack } from "@/components/shared/primitives";
import { BarChart3, BriefcaseBusiness, ExternalLink, TrendingUp } from "lucide-react";
import Link from "next/link";

export interface FeaturedCareer {
  slug: string;
  label: string;
  eyebrow: string;
  title: string;
  description: string;
  salary: string;
  range: string;
  insight: string;
  tools: string[];
  partners: string[];
}

interface FeaturedCareerSectionProps {
  careers: FeaturedCareer[];
  activeIndex?: number;
}

export function FeaturedCareerSection({
  careers,
  activeIndex = 0,
}: FeaturedCareerSectionProps) {
  const featured = careers[activeIndex] ?? careers[0];

  return (
    <Stack gap={32}>
      <Stack gap={12} align="center" className="text-center">
        <p className="text-sm font-medium text-[#22577A]">
          Trending Career Tracks
        </p>
        <p className="max-w-2xl text-sm leading-relaxed text-[#6B7280]">
          Discover the most in-demand specializations shaping the Indian tech
          landscape.
        </p>

        <Inline gap={6} className="rounded-full bg-[#F9FAFB] p-1">
          {careers.map((career, index) => (
            <button
              key={career.label}
              className={`h-9 rounded-full px-5 text-sm font-medium transition ${
                index === activeIndex
                  ? "bg-white text-[#0F172A] shadow-sm"
                  : "text-[#6B7280] hover:text-[#0F172A]"
              }`}
            >
              {career.label}
            </button>
          ))}
        </Inline>
      </Stack>

      <Grid className="grid-cols-1 gap-8 bg-[#38A3A5]/10 p-6 md:p-8 lg:grid-cols-[1fr_380px]">
        <Stack gap={24}>
          <Stack gap={14}>
            <Badge className="w-fit border-[#38A3A5]/20 bg-[#38A3A5]/10 text-[#22577A]">
              {featured.eyebrow}
            </Badge>
            <h2 className="text-3xl font-semibold tracking-tight text-[#0F172A] lg:text-4xl">
              {featured.title}
            </h2>
            <p className="max-w-3xl text-base leading-relaxed text-[#6B7280]">
              {featured.description}
            </p>
          </Stack>

          <Stack gap={10}>
            <p className="text-xs font-medium text-[#E86C0D]">
              Master These Tools
            </p>
            <Inline gap={8} wrap justify="start">
              {featured.tools.map((tool) => (
                <Badge
                  key={tool}
                  variant="secondary"
                  className="rounded-full bg-[#F9FAFB] text-[#22577A]"
                >
                  {tool}
                </Badge>
              ))}
            </Inline>
          </Stack>

          <Stack gap={10}>
            <p className="text-xs font-medium text-[#6B7280]">
              Career Progression Track
            </p>
            <div className="relative grid grid-cols-2 gap-5 pt-3 sm:grid-cols-4">
              <div className="absolute left-2 right-2 top-[18px] hidden h-px bg-[#38A3A5]/30 sm:block" />
              {["Intern", "Associate", "Lead", "Architect"].map(
                (step, index) => (
                  <Stack key={step} gap={6} className="relative">
                    <span
                      className={`z-10 h-3 w-3 rounded-full ring-4 ring-[#EAF7F7] ${
                        index === 0 ? "bg-[#FF7A0E]" : "bg-[#E9EAF0]"
                      }`}
                    />
                    <span className="text-sm font-semibold text-[#0F172A]">
                      {step}
                    </span>
                    <span className="text-xs text-slate-400">
                      {["8L", "15L", "28L", "42L+"][index]}
                    </span>
                  </Stack>
                ),
              )}
            </div>
          </Stack>

          <Stack gap={10}>
            <p className="text-xs font-medium text-[#6B7280]">
              Top Hiring Partners
            </p>
            <Inline gap={8} wrap justify="start">
              {featured.partners.map((partner) => (
                <span
                  key={partner}
                  className="rounded-full bg-[#F9FAFB] px-3 py-1.5 text-xs font-semibold text-[#22577A]"
                >
                  {partner}
                </span>
              ))}
            </Inline>
          </Stack>
        </Stack>

        <Stack className="border border-[#38A3A5]/20 bg-white p-6" gap={22}>
          <p className="text-sm font-medium text-[#22577A]">Market insight</p>
          <Insight
            icon={<BarChart3 className="size-5" />}
            title="Demand scarcity"
            text={featured.insight}
          />
          <Insight
            icon={<TrendingUp className="size-5" />}
            title="Salary range"
            text={`${featured.range} for strong mid-level candidates.`}
          />
          <Insight
            icon={<BriefcaseBusiness className="size-5" />}
            title="Hiring signal"
            text="Strong demand from product teams, services firms, and funded startups."
          />
          <Link
            href={`/career-path/${featured.slug}`}
            className="mt-2 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#0F172A] px-4 text-sm font-medium text-white transition hover:bg-[#1E293B]"
          >
            View full career path
            <ExternalLink className="size-4" />
          </Link>
        </Stack>
      </Grid>
    </Stack>
  );
}

function Insight({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <Inline gap={12} align="start" justify="start">
      <span className="rounded-lg bg-[#38A3A5]/10 p-2 text-[#22577A]">
        {icon}
      </span>
      <Stack gap={3}>
        <p className="text-sm font-semibold text-[#0F172A]">{title}</p>
        <p className="text-sm leading-6 text-[#6B7280]">{text}</p>
      </Stack>
    </Inline>
  );
}
