import { Box, Inline, Stack } from "@/components/shared/primitives";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, ExternalLink, ShieldCheck } from "lucide-react";
import Link from "next/link";

export type CertificationType = "Program" | "Track" | "Course";
export type CertificationDomain =
  | "Full Stack"
  | "Data"
  | "AI"
  | "DevOps"
  | "Security";

export interface CertificationCardData {
  id: string;
  title: string;
  description: string;
  type: CertificationType;
  domain: CertificationDomain;
  level: string;
  duration: string;
  skills: string[];
  href: string;
}

interface CertificationCardProps {
  certification: CertificationCardData;
}

export function CertificationCard({ certification }: CertificationCardProps) {
  return (
    <Stack
      gap={22}
      className="rounded-xl border border-[#E9EAF0] bg-white p-6 shadow-[0_18px_54px_rgba(15,23,42,0.05)] transition hover:border-[#38A3A5]/40 hover:shadow-[0_24px_70px_rgba(34,87,122,0.1)]"
    >
      <Inline>
        <span className="grid size-11 place-items-center rounded-xl bg-[#38A3A5]/10 text-[#22577A]">
          <Award className="size-5" />
        </span>
        <Badge className="rounded-full border-[#FF7A0E]/20 bg-[#FFEEE8] text-[#E86C0D]">
          {certification.type}
        </Badge>
      </Inline>

      <Stack gap={10}>
        <h3 className="text-xl font-bold leading-tight text-[#0F172A]">
          {certification.title}
        </h3>
        <p className="text-sm leading-6 text-[#6B7280]">
          {certification.description}
        </p>
      </Stack>

      <Inline gap={10} wrap justify="start">
        <span className="rounded-full bg-[#F9FAFB] px-3 py-1 text-xs font-semibold text-[#22577A]">
          {certification.domain}
        </span>
        <span className="rounded-full bg-[#F9FAFB] px-3 py-1 text-xs font-semibold text-[#22577A]">
          {certification.level}
        </span>
        <span className="rounded-full bg-[#F9FAFB] px-3 py-1 text-xs font-semibold text-[#22577A]">
          {certification.duration}
        </span>
      </Inline>

      <Box className="h-px bg-[#E9EAF0]" />

      <Inline gap={8} wrap justify="start">
        {certification.skills.map((skill) => (
          <span key={skill} className="text-xs font-medium text-[#8C94A3]">
            {skill}
          </span>
        ))}
      </Inline>

      <Inline>
        <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#38A3A5]">
          <ShieldCheck className="size-4" />
          Verifiable
        </span>
        <Button asChild size="sm" variant="outline">
          <Link href={certification.href}>
            Details
            <ExternalLink className="size-4" />
          </Link>
        </Button>
      </Inline>
    </Stack>
  );
}
