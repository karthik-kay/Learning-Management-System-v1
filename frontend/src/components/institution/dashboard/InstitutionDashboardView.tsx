"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  GraduationCap,
  Users,
} from "lucide-react";

import { Grid, Inline, Stack } from "@/components/shared/primitives";
import { cn } from "@/lib/utils";

import KpiCard from "./widgets/analytics/kpi-strip/blocks/KpiCard";
import KpiLabel from "./widgets/analytics/kpi-strip/blocks/KpiLabel";
import KpiTrend from "./widgets/analytics/kpi-strip/blocks/KpiTrend";
import KpiValue from "./widgets/analytics/kpi-strip/blocks/KpiValue";
import {
  InstitutionHierarchy,
  type HierarchyNode,
  type HierarchySummaryItem,
} from "./widgets/hierarchy/institution-tree";

type Tone = "teal" | "orange" | "blue" | "rose" | "slate";

export interface DashboardMetric {
  label: string;
  value: string;
  helper: string;
  trend?: string;
  tone?: Tone;
}

export interface DashboardQueueItem {
  title: string;
  meta: string;
  count: string;
  href: string;
  tone?: Tone;
}

export interface DashboardClassItem {
  time: string;
  title: string;
  meta: string;
  status: string;
}

export interface DashboardRiskItem {
  name: string;
  detail: string;
  severity: "High" | "Medium" | "Low";
}

export interface DashboardActivityItem {
  title: string;
  time: string;
  tone?: Tone;
}

export interface InstitutionDashboardViewProps {
  eyebrow: string;
  title: string;
  description: string;
  scopeLabel: string;
  primaryAction: {
    label: string;
    href: string;
  };
  metrics: DashboardMetric[];
  hierarchySummary: HierarchySummaryItem[];
  hierarchyTree: HierarchyNode[];
  queues: DashboardQueueItem[];
  classes: DashboardClassItem[];
  risks: DashboardRiskItem[];
  activities: DashboardActivityItem[];
}

const toneClasses: Record<Tone, string> = {
  teal: "bg-[#E7F6F5] text-[#22577A] border-[#38A3A5]/20",
  orange: "bg-[#FFF0E8] text-[#E86C0D] border-[#FF7A0E]/20",
  blue: "bg-[#EAF2FF] text-[#22577A] border-[#22577A]/15",
  rose: "bg-rose-50 text-rose-700 border-rose-200",
  slate: "bg-slate-100 text-slate-700 border-slate-200",
};

const iconMap = [Users, GraduationCap, BookOpen, BarChart3, CalendarDays];

export function InstitutionDashboardView({
  eyebrow,
  title,
  description,
  scopeLabel,
  primaryAction,
  metrics,
  hierarchySummary,
  hierarchyTree,
  queues,
  classes,
  risks,
  activities,
}: InstitutionDashboardViewProps) {
  return (
    <Stack gap={24}>
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_360px]">
          <Stack gap={22} className="p-6 md:p-8">
            <Inline wrap justify="between" className="gap-3">
              <span className="inline-flex w-fit rounded-full bg-[#E7F6F5] px-3 py-1 text-sm font-medium text-[#22577A]">
                {eyebrow}
              </span>
              <span className="inline-flex w-fit rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-600">
                {scopeLabel}
              </span>
            </Inline>

            <Stack gap={10}>
              <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-[#0F172A] md:text-4xl">
                {title}
              </h1>
              <p className="max-w-3xl text-base leading-7 text-slate-600">
                {description}
              </p>
            </Stack>

            <Inline wrap justify="start" className="gap-3">
              <Link
                href={primaryAction.href}
                className="inline-flex items-center gap-2 rounded-xl bg-[#0F172A] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#22577A]"
              >
                {primaryAction.label}
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/institution/reports"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#0F172A] transition hover:border-[#38A3A5]/40 hover:bg-[#E7F6F5]"
              >
                View reports
              </Link>
            </Inline>
          </Stack>

          <div className="border-t border-slate-200 bg-[#0F172A] p-6 text-white lg:border-l lg:border-t-0 md:p-8">
            <Stack gap={16}>
              <p className="text-sm font-medium text-[#57CC99]">
                Today at a glance
              </p>
              {queues.slice(0, 3).map((queue) => (
                <Link
                  key={queue.title}
                  href={queue.href}
                  className="group rounded-2xl bg-white/7 p-4 transition hover:bg-white/12"
                >
                  <Inline align="start" gap={12}>
                    <Stack gap={4}>
                      <p className="text-sm font-semibold">{queue.title}</p>
                      <p className="text-xs text-slate-300">{queue.meta}</p>
                    </Stack>
                    <span className="text-lg font-semibold text-[#FF7A0E]">
                      {queue.count}
                    </span>
                  </Inline>
                </Link>
              ))}
            </Stack>
          </div>
        </div>
      </section>

      <Grid className="grid-cols-1 sm:grid-cols-2 xl:grid-cols-5" gap={16}>
        {metrics.map((metric, index) => {
          const Icon = iconMap[index % iconMap.length];

          return (
            <KpiCard
              key={metric.label}
              className="border-slate-200 bg-white transition hover:border-[#38A3A5]/30"
            >
              <Stack gap={16}>
                <Inline>
                  <span
                    className={cn(
                      "inline-flex size-10 items-center justify-center rounded-xl border",
                      toneClasses[metric.tone ?? "slate"],
                    )}
                  >
                    <Icon className="size-5" />
                  </span>
                  {metric.trend ? <KpiTrend>{metric.trend}</KpiTrend> : null}
                </Inline>
                <Stack gap={4}>
                  <KpiLabel>{metric.label}</KpiLabel>
                  <KpiValue>{metric.value}</KpiValue>
                  <p className="text-xs leading-5 text-slate-500">
                    {metric.helper}
                  </p>
                </Stack>
              </Stack>
            </KpiCard>
          );
        })}
      </Grid>

      <DashboardPanel
        eyebrow="Hierarchy"
        title="Institution structure overview"
        action={{ label: "Manage departments", href: "/institution/departments" }}
      >
        <InstitutionHierarchy summary={hierarchySummary} tree={hierarchyTree} />
      </DashboardPanel>

      <Grid className="grid-cols-1 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]" gap={24}>
        <Stack gap={24}>
          <DashboardPanel
            eyebrow="Academic operations"
            title="Classes, attendance and assessment pulse"
            action={{ label: "Open timetable", href: "/institution/timetable" }}
          >
            <Grid className="grid-cols-1 lg:grid-cols-2" gap={16}>
              {classes.map((item) => (
                <article
                  key={`${item.time}-${item.title}`}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <Stack gap={12}>
                    <Inline>
                      <span className="inline-flex items-center gap-2 text-sm font-medium text-[#22577A]">
                        <Clock3 className="size-4" />
                        {item.time}
                      </span>
                      <span className="rounded-full bg-white px-2.5 py-1 text-xs text-slate-600">
                        {item.status}
                      </span>
                    </Inline>
                    <Stack gap={4}>
                      <h3 className="font-semibold text-[#0F172A]">
                        {item.title}
                      </h3>
                      <p className="text-sm leading-6 text-slate-600">
                        {item.meta}
                      </p>
                    </Stack>
                  </Stack>
                </article>
              ))}
            </Grid>
          </DashboardPanel>

          <DashboardPanel
            eyebrow="Risk watch"
            title="Students and cohorts needing attention"
            action={{ label: "View attendance", href: "/institution/attendance" }}
          >
            <Stack gap={12}>
              {risks.map((risk) => (
                <Inline
                  key={risk.name}
                  className="rounded-2xl border border-slate-200 bg-white p-4"
                  align="start"
                >
                  <Inline justify="start" gap={12}>
                    <span
                      className={cn(
                        "inline-flex size-10 items-center justify-center rounded-xl",
                        risk.severity === "High"
                          ? "bg-rose-50 text-rose-600"
                          : risk.severity === "Medium"
                            ? "bg-[#FFF0E8] text-[#E86C0D]"
                            : "bg-[#E7F6F5] text-[#38A3A5]",
                      )}
                    >
                      <AlertTriangle className="size-5" />
                    </span>
                    <Stack gap={2}>
                      <p className="font-semibold text-[#0F172A]">
                        {risk.name}
                      </p>
                      <p className="text-sm text-slate-600">{risk.detail}</p>
                    </Stack>
                  </Inline>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600">
                    {risk.severity}
                  </span>
                </Inline>
              ))}
            </Stack>
          </DashboardPanel>
        </Stack>

        <Stack gap={24}>
          <DashboardPanel
            eyebrow="Work queue"
            title="Pending actions"
            action={{ label: "See all", href: "/institution/notifications" }}
          >
            <Stack gap={12}>
              {queues.map((queue) => (
                <Link
                  key={queue.title}
                  href={queue.href}
                  className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-[#38A3A5]/40 hover:bg-[#F9FAFB]"
                >
                  <Inline align="start" gap={12}>
                    <Stack gap={4}>
                      <p className="font-semibold text-[#0F172A]">
                        {queue.title}
                      </p>
                      <p className="text-sm leading-5 text-slate-600">
                        {queue.meta}
                      </p>
                    </Stack>
                    <span
                      className={cn(
                        "rounded-full border px-2.5 py-1 text-sm font-semibold",
                        toneClasses[queue.tone ?? "slate"],
                      )}
                    >
                      {queue.count}
                    </span>
                  </Inline>
                </Link>
              ))}
            </Stack>
          </DashboardPanel>

          <DashboardPanel eyebrow="Activity" title="Recent institution events">
            <Stack gap={14}>
              {activities.map((activity) => (
                <Inline key={`${activity.title}-${activity.time}`} align="start" gap={12}>
                  <span
                    className={cn(
                      "mt-1 inline-flex size-8 items-center justify-center rounded-full border",
                      toneClasses[activity.tone ?? "slate"],
                    )}
                  >
                    <CheckCircle2 className="size-4" />
                  </span>
                  <Stack gap={2}>
                    <p className="text-sm font-medium leading-5 text-[#0F172A]">
                      {activity.title}
                    </p>
                    <p className="text-xs text-slate-500">{activity.time}</p>
                  </Stack>
                </Inline>
              ))}
            </Stack>
          </DashboardPanel>
        </Stack>
      </Grid>
    </Stack>
  );
}

function DashboardPanel({
  eyebrow,
  title,
  action,
  children,
}: {
  eyebrow: string;
  title: string;
  action?: {
    label: string;
    href: string;
  };
  children: ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <Stack gap={20}>
        <Inline align="start" className="gap-4">
          <Stack gap={4}>
            <p className="text-sm font-medium text-[#E86C0D]">{eyebrow}</p>
            <h2 className="text-xl font-semibold tracking-tight text-[#0F172A]">
              {title}
            </h2>
          </Stack>
          {action ? (
            <Link
              href={action.href}
              className="hidden shrink-0 items-center gap-1 text-sm font-semibold text-[#22577A] hover:text-[#38A3A5] sm:inline-flex"
            >
              {action.label}
              <ArrowRight className="size-4" />
            </Link>
          ) : null}
        </Inline>
        {children}
      </Stack>
    </section>
  );
}
