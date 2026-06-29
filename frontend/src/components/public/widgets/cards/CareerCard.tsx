import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Grid, Inline, Stack } from "@/components/shared/primitives";
import { ArrowUpRight, LineChart } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

export interface CareerCardData {
  title: string;
  tag: string;
  description: string;
  salary: string;
  skills: string[];
  slug?: string;
}

interface CareerCardProps {
  career: CareerCardData;
  index?: number;
  primaryAction?: ReactNode;
  secondaryAction?: ReactNode;
  className?: string;
}

export function CareerCard({
  career,
  index,
  primaryAction,
  secondaryAction,
  className,
}: CareerCardProps) {
  return (
    <Grid
      className={`grid-cols-1 gap-5 border border-[#E9EAF0] bg-white p-5 transition hover:border-[#38A3A5]/40 hover:shadow-[0_18px_50px_rgba(34,87,122,0.08)] md:grid-cols-[48px_1fr_160px_118px] md:items-center ${className ?? ""}`}
    >
      <span className="text-2xl font-semibold text-[#D8DCE5]">
        {typeof index === "number" ? String(index + 1).padStart(2, "0") : ""}
      </span>

      <Stack gap={10}>
        <Inline gap={10} justify="start" wrap>
          <h3 className="text-lg font-semibold text-[#0F172A]">
            {career.title}
          </h3>
          <Badge
            variant="secondary"
            className="rounded-full bg-[#FFEEE8] text-xs font-medium text-[#E86C0D]"
          >
            {career.tag}
          </Badge>
        </Inline>

        <p className="text-sm leading-relaxed text-[#6B7280]">
          {career.description}
        </p>

        <Inline gap={8} wrap justify="start">
          {career.skills.map((skill) => (
            <span
              key={skill}
              className="rounded-full bg-[#F9FAFB] px-2.5 py-1 text-xs font-medium text-[#22577A]"
            >
              {skill}
            </span>
          ))}
        </Inline>
      </Stack>

      <Stack gap={4}>
        <span className="text-lg font-semibold text-[#22577A]">
          {career.salary}
        </span>
        <span className="text-xs font-medium text-slate-400">
          Avg market package
        </span>
      </Stack>

      <Stack gap={8}>
        {primaryAction ?? (
          <Button
            asChild
            size="sm"
            className="bg-[#0F172A] text-white hover:bg-[#1E293B]"
          >
            <Link href={`/career-path/${career.slug ?? slugify(career.title)}`}>
              View path
              <ArrowUpRight className="size-4" />
            </Link>
          </Button>
        )}
        {secondaryAction ?? (
          <Button size="sm" variant="outline">
            <LineChart className="size-4" />
            Syllabus
          </Button>
        )}
      </Stack>
    </Grid>
  );
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
