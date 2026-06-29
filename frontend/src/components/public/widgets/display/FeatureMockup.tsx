import type { ReactNode } from "react";

import { Box, Grid, Inline, Stack } from "@/components/shared/primitives";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type FeatureMockupType =
  | "ide"
  | "dashboard"
  | "mentor"
  | "projects"
  | "live-class"
  | "certificate";

interface FeatureMockupProps {
  type: FeatureMockupType;
  className?: string;
}

export function FeatureMockup({ type, className }: FeatureMockupProps) {
  return (
    <Box className={cn("h-full min-h-[280px] text-white", className)}>
      {type === "ide" && <IdeMockup />}
      {type === "dashboard" && <DashboardMockup />}
      {type === "mentor" && <MentorMockup />}
      {type === "projects" && <ProjectsMockup />}
      {type === "live-class" && <LiveClassMockup />}
      {type === "certificate" && <CertificateMockup />}
    </Box>
  );
}

function WindowFrame({ children }: { children: ReactNode }) {
  return (
    <Box className="overflow-hidden rounded-xl border border-white/10 bg-[#171717] shadow-2xl">
      <Inline justify="start" gap={8} className="border-b border-white/10 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#EF4444]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#F59E0B]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#22C55E]" />
        <span className="ml-2 text-xs text-white/40">LearnerSlate</span>
      </Inline>
      {children}
    </Box>
  );
}

function IdeMockup() {
  return (
    <Stack gap={18} className="h-full">
      <Stack gap={6}>
        <p className="text-xl font-bold">Cloud IDE</p>
        <p className="max-w-sm text-sm text-white/55">
          Code, run, test, and submit without local setup.
        </p>
      </Stack>

      <WindowFrame>
        <Grid className="grid-cols-[0.8fr_1.6fr]" gap={0}>
          <Stack gap={8} className="border-r border-white/10 bg-white/[0.03] p-4">
            {["app.tsx", "api.ts", "tests.ts"].map((file, index) => (
              <Inline
                key={file}
                justify="start"
                gap={8}
                className={cn(
                  "rounded-md px-2 py-1 text-xs text-white/55",
                  index === 0 && "bg-[#FF7A0E]/15 text-[#FFB36C]",
                )}
              >
                <span className="h-2 w-2 rounded-full bg-[#FF7A0E]" />
                {file}
              </Inline>
            ))}
          </Stack>

          <Stack gap={8} className="p-4 font-mono text-xs">
            <span className="text-[#7DD3FC]">import</span>
            <span className="pl-4 text-white/70">function runProject()</span>
            <span className="pl-8 text-[#FFB36C]">return "ready";</span>
            <Box className="mt-2 rounded-lg bg-black/40 p-3 text-[#86EFAC]">
              npm test -- passed
            </Box>
          </Stack>
        </Grid>
      </WindowFrame>
    </Stack>
  );
}

function DashboardMockup() {
  return (
    <Stack gap={18} className="h-full">
      <Inline>
        <Stack gap={4}>
          <p className="text-xl font-bold">Student Dashboard</p>
          <p className="text-sm text-white/55">Your learning cockpit.</p>
        </Stack>
        <Badge className="bg-[#FF7A0E] text-white">Live</Badge>
      </Inline>

      <Grid className="grid-cols-2" gap={12}>
        {[
          ["82%", "Course Progress"],
          ["14", "Projects"],
          ["6", "Certificates"],
          ["24h", "This Week"],
        ].map(([value, label]) => (
          <Stack key={label} gap={6} className="rounded-xl bg-white/[0.06] p-4">
            <p className="text-2xl font-black">{value}</p>
            <p className="text-xs text-white/45">{label}</p>
          </Stack>
        ))}
      </Grid>

      <Stack gap={8} className="rounded-xl bg-white/[0.06] p-4">
        <Inline>
          <span className="text-sm font-semibold">Full Stack Roadmap</span>
          <span className="text-xs text-[#FFB36C]">82%</span>
        </Inline>
        <Box className="h-2 overflow-hidden rounded-full bg-white/10">
          <Box className="h-full w-[82%] rounded-full bg-[#FF7A0E]" />
        </Box>
      </Stack>
    </Stack>
  );
}

function MentorMockup() {
  return (
    <Stack gap={18} className="h-full">
      <Stack gap={6}>
        <p className="text-xl font-bold">AI Mentor</p>
        <p className="max-w-sm text-sm text-white/55">
          Personalized guidance across lessons and projects.
        </p>
      </Stack>

      <Stack gap={10} className="rounded-xl bg-white/[0.06] p-4">
        <Box className="max-w-[80%] rounded-2xl rounded-tl-sm bg-white/10 p-3 text-sm text-white/75">
          I am stuck on async functions. What should I revise?
        </Box>
        <Box className="ml-auto max-w-[84%] rounded-2xl rounded-tr-sm bg-[#FF7A0E] p-3 text-sm font-medium text-white">
          Review promises first, then complete the API project checkpoint.
        </Box>
        <Box className="max-w-[76%] rounded-2xl rounded-tl-sm bg-white/10 p-3 text-sm text-white/75">
          Added a 20 minute practice set to your plan.
        </Box>
      </Stack>
    </Stack>
  );
}

function ProjectsMockup() {
  return (
    <Stack gap={18} className="h-full">
      <Stack gap={6}>
        <p className="text-xl font-bold">Real Projects</p>
        <p className="max-w-sm text-sm text-white/55">
          Build proof-of-work, not just course completion.
        </p>
      </Stack>

      <Grid className="grid-cols-3" gap={10}>
        {["Plan", "Build", "Review"].map((column, index) => (
          <Stack key={column} gap={8} className="rounded-xl bg-white/[0.05] p-3">
            <p className="text-xs font-semibold text-white/55">{column}</p>
            {[0, 1, 2].slice(0, index + 1).map((item) => (
              <Box key={item} className="rounded-lg bg-white/10 p-3">
                <Box className="mb-2 h-2 w-8/12 rounded-full bg-white/25" />
                <Box className="h-2 w-5/12 rounded-full bg-[#FF7A0E]/70" />
              </Box>
            ))}
          </Stack>
        ))}
      </Grid>
    </Stack>
  );
}

function LiveClassMockup() {
  return (
    <Stack gap={18} className="h-full">
      <Inline>
        <Stack gap={4}>
          <p className="text-xl font-bold">Live Classes</p>
          <p className="text-sm text-white/55">Mentor-led sessions and Q&A.</p>
        </Stack>
        <Badge className="bg-red-500 text-white">On Air</Badge>
      </Inline>

      <Grid className="grid-cols-[1.5fr_0.8fr]" gap={12}>
        <Box className="relative min-h-[180px] overflow-hidden rounded-xl bg-white/[0.08]">
          <Box className="absolute inset-6 rounded-xl border border-white/10 bg-black/30" />
          <Box className="absolute bottom-4 left-4 rounded-lg bg-black/50 px-3 py-2 text-xs">
            System Design Basics
          </Box>
        </Box>
        <Stack gap={8}>
          {["Aarav", "Meera", "Dev"].map((name) => (
            <Inline
              key={name}
              justify="start"
              gap={8}
              className="rounded-lg bg-white/[0.06] p-2"
            >
              <span className="h-7 w-7 rounded-full bg-[#FF7A0E]/70" />
              <span className="text-xs text-white/65">{name}</span>
            </Inline>
          ))}
        </Stack>
      </Grid>
    </Stack>
  );
}

function CertificateMockup() {
  return (
    <Stack gap={18} className="h-full">
      <Stack gap={6}>
        <p className="text-xl font-bold">Verified Certificates</p>
        <p className="max-w-sm text-sm text-white/55">
          Share credentials that are easy to verify.
        </p>
      </Stack>

      <Box className="rounded-xl bg-white p-6 text-[#111111] shadow-2xl">
        <Inline>
          <span className="text-xs font-black uppercase tracking-[0.22em] text-[#FF7A0E]">
            LearnerSlate
          </span>
          <Badge variant="outline">Verified</Badge>
        </Inline>
        <Stack gap={10} className="py-8 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Certificate of Completion
          </p>
          <p className="text-2xl font-black">Full Stack Engineering</p>
          <p className="text-sm text-slate-500">Issued to a career-ready learner</p>
        </Stack>
        <Inline>
          <Box className="h-8 w-24 rounded bg-slate-100" />
          <Box className="h-8 w-8 rounded bg-[#FF7A0E]" />
        </Inline>
      </Box>
    </Stack>
  );
}
