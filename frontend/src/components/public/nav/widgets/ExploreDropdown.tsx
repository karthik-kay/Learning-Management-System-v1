"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  ChevronDown,
  Code2,
  GraduationCap,
  Layers3,
  Map,
  Presentation,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Box, Grid, Inline, Stack } from "@/components/shared/primitives";

const featuredItems = [
  {
    label: "Find your career path",
    description: "Compare software roles and salary-backed learning tracks.",
    href: "/career-path",
    icon: <BriefcaseBusiness className="size-4" />,
  },
  {
    label: "Explore programs",
    description: "Choose between long-term and fast-track learning paths.",
    href: "/programs",
    icon: <GraduationCap className="size-4" />,
  },
  {
    label: "Career roadmaps",
    description: "Follow skill paths for full stack, AI, DevOps, and more.",
    href: "/roadmaps",
    icon: <Map className="size-4" />,
  },
  {
    label: "Events",
    description:
      "Enroll and participate in trending events, webinars, hackathons and live bounties and much more ",
    href: "/events",
    icon: <Presentation className="size-4" />,
  },
];

const columns = [
  {
    title: "Learn",
    items: [
      {
        label: "Programs",
        href: "/programs",
        icon: <Layers3 className="size-4" />,
      },
      {
        label: "Courses",
        href: "/courses",
        icon: <BookOpen className="size-4" />,
      },
      {
        label: "Roadmaps",
        href: "/roadmaps",
        icon: <Map className="size-4" />,
      },
      {
        label: "Certifications",
        href: "/certifications",
        icon: <Trophy className="size-4" />,
      },
    ],
  },
  {
    title: "Career",
    items: [
      {
        label: "Career Paths",
        href: "/career-path",
        icon: <BriefcaseBusiness className="size-4" />,
      },
      {
        label: "Placements",
        href: "/placements",
        icon: <Sparkles className="size-4" />,
      },
      {
        label: "Mentors",
        href: "/mentors",
        icon: <Users className="size-4" />,
      },
      {
        label: "Assessments",
        href: "/practice",
        icon: <Code2 className="size-4" />,
      },
    ],
  },
];

const trendingSkills = [
  "Python",
  "Full Stack",
  "AI/ML",
  "System Design",
  "SQL",
  "Cloud",
];

interface ExploreDropdownProps {
  mobile?: boolean;
}

export function ExploreDropdown({ mobile = false }: ExploreDropdownProps) {
  if (mobile) {
    return (
      <Stack gap={14}>
        <Link href="/programs" className="text-sm font-medium">
          Explore Programs
        </Link>
        <Link href="/career-path" className="text-sm font-medium">
          Career Paths
        </Link>
        <Link href="/courses" className="text-sm font-medium">
          Courses
        </Link>
        <Link href="/roadmaps" className="text-sm font-medium">
          Roadmaps
        </Link>
        <Link href="/mentors" className="text-sm font-medium">
          Mentors
        </Link>
      </Stack>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex h-9 items-center gap-2 rounded-lg bg-slate-100 px-4 text-sm font-semibold text-slate-800 transition hover:bg-orange-50 hover:text-orange-600 data-[state=open]:bg-orange-50 data-[state=open]:text-orange-600">
        Explore
        <ChevronDown className="size-4 transition-transform data-[state=open]:rotate-180" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        sideOffset={14}
        className="w-[760px] rounded-xl border-slate-200 bg-white p-0 shadow-2xl shadow-slate-900/10"
      >
        <Grid className="grid-cols-[260px_1fr]">
          <Stack gap={10} className="border-r bg-slate-50 p-4">
            <p className="px-2 text-xs font-bold uppercase tracking-widest text-slate-400">
              Recommended
            </p>

            {featuredItems.map((item) => (
              <DropdownMenuItem key={item.label} asChild>
                <Link
                  href={item.href}
                  className="group flex items-start gap-3 rounded-lg p-3 outline-none transition hover:bg-white"
                >
                  <span className="grid size-9 place-items-center rounded-lg bg-white text-orange-500 shadow-sm">
                    {item.icon}
                  </span>
                  <Stack gap={3}>
                    <Inline gap={8} justify="start">
                      <span className="text-sm font-bold text-slate-950">
                        {item.label}
                      </span>
                      <ArrowRight className="size-3.5 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-orange-500" />
                    </Inline>
                    <span className="text-xs leading-relaxed text-slate-500">
                      {item.description}
                    </span>
                  </Stack>
                </Link>
              </DropdownMenuItem>
            ))}
          </Stack>

          <Stack gap={18} className="p-5">
            <Grid className="grid-cols-2 gap-8">
              {columns.map((column) => (
                <Stack key={column.title} gap={12}>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    {column.title}
                  </p>

                  <Stack gap={4}>
                    {column.items.map((item) => (
                      <DropdownMenuItem key={item.label} asChild>
                        <Link
                          href={item.href}
                          className="group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 outline-none transition hover:bg-slate-50 hover:text-slate-950"
                        >
                          <Inline gap={10} justify="start">
                            <span className="text-slate-400 group-hover:text-orange-500">
                              {item.icon}
                            </span>
                            {item.label}
                          </Inline>
                          <ArrowRight className="size-3.5 text-slate-300 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </Stack>
                </Stack>
              ))}
            </Grid>

            <DropdownMenuSeparator className="mx-0" />

            <Box>
              <Inline gap={10} justify="start" wrap>
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  Trending skills
                </span>
                {trendingSkills.map((skill) => (
                  <Link
                    key={skill}
                    href={`/courses?skill=${encodeURIComponent(skill.toLowerCase())}`}
                    className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600"
                  >
                    {skill}
                  </Link>
                ))}
              </Inline>
            </Box>
          </Stack>
        </Grid>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
