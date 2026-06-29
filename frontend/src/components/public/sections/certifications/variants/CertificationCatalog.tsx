"use client";

import { CertificationGrid } from "./CertificationGrid";
import {
  CertificationCardData,
  CertificationDomain,
  CertificationType,
} from "@/components/public/widgets/cards/CertificationCard";
import { Grid, Inline, Stack } from "@/components/shared/primitives";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";

const typeFilters = ["All", "Program", "Track", "Course"] as const;
const domainFilters = [
  "All",
  "Full Stack",
  "Data",
  "AI",
  "DevOps",
  "Security",
] as const;

interface CertificationCatalogProps {
  certifications: CertificationCardData[];
}

export function CertificationCatalog({
  certifications,
}: CertificationCatalogProps) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<(typeof typeFilters)[number]>("All");
  const [domain, setDomain] = useState<(typeof domainFilters)[number]>("All");

  const filteredCertifications = useMemo(() => {
    return certifications.filter((certification) => {
      const matchesQuery =
        !query ||
        certification.title.toLowerCase().includes(query.toLowerCase()) ||
        certification.description.toLowerCase().includes(query.toLowerCase()) ||
        certification.skills.some((skill) =>
          skill.toLowerCase().includes(query.toLowerCase()),
        );
      const matchesType =
        type === "All" || certification.type === (type as CertificationType);
      const matchesDomain =
        domain === "All" ||
        certification.domain === (domain as CertificationDomain);

      return matchesQuery && matchesType && matchesDomain;
    });
  }, [certifications, domain, query, type]);

  return (
    <Stack gap={28}>
      <Stack
        gap={18}
        className="rounded-xl border border-[#E9EAF0] bg-white p-4 shadow-[0_18px_54px_rgba(15,23,42,0.05)]"
      >
        <Grid className="grid-cols-1 gap-4 lg:grid-cols-[1fr_240px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#8C94A3]" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search certificates, skills, or domains"
              className="h-11 rounded-lg border-[#E9EAF0] bg-[#F9FAFB] pl-10"
            />
          </div>

          <Select
            value={domain}
            onValueChange={(value) =>
              setDomain(value as (typeof domainFilters)[number])
            }
          >
            <SelectTrigger className="h-11 w-full rounded-lg border-[#E9EAF0] bg-[#F9FAFB]">
              <span className="inline-flex items-center gap-2">
                <SlidersHorizontal className="size-4 text-[#38A3A5]" />
                <SelectValue placeholder="Domain" />
              </span>
            </SelectTrigger>
            <SelectContent>
              {domainFilters.map((item) => (
                <SelectItem key={item} value={item}>
                  {item === "All" ? "All Domains" : item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Grid>

        <TypeChips value={type} onChange={setType} />
      </Stack>

      <Inline>
        <p className="text-sm font-medium text-[#6B7280]">
          Showing{" "}
          <span className="font-bold text-[#0F172A]">
            {filteredCertifications.length}
          </span>{" "}
          certifications
        </p>
      </Inline>

      <CertificationGrid certifications={filteredCertifications} />
    </Stack>
  );
}

function TypeChips({
  value,
  onChange,
}: {
  value: (typeof typeFilters)[number];
  onChange: (value: (typeof typeFilters)[number]) => void;
}) {
  return (
    <Inline gap={10} justify="start" wrap>
      {typeFilters.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onChange(item)}
          className={`h-8 rounded-full px-3 text-xs font-bold transition ${
            value === item
              ? "bg-[#0F172A] text-white"
              : "bg-[#F9FAFB] text-[#6B7280] hover:bg-[#FFEEE8] hover:text-[#E86C0D]"
          }`}
        >
          {item}
        </button>
      ))}
    </Inline>
  );
}
