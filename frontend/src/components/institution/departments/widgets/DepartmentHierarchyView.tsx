"use client";

import { Building2, FolderTree, GraduationCap, Layers3, UsersRound } from "lucide-react";
import { useRouter } from "next/navigation";

import type { AcademicBatch, Department, Program, Section } from "@/types/institution";

interface DepartmentHierarchyViewProps {
  departments: Department[];
  programs: Program[];
  batches: AcademicBatch[];
  sections: Section[];
}

export function DepartmentHierarchyView({
  departments,
  programs,
  batches,
  sections,
}: DepartmentHierarchyViewProps) {
  const router = useRouter();

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[#E86C0D]">Hierarchy</p>
          <h2 className="mt-1 text-xl font-semibold text-[#0F172A]">
            Academic structure tree
          </h2>
        </div>
        <FolderTree className="size-5 text-[#38A3A5]" />
      </div>

      <div className="space-y-4">
        {departments.length ? (
          departments.map((department) => {
            const departmentPrograms = programs.filter(
              (program) => program.department_name === department.name,
            );

            return (
              <div
                key={department.id}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >
                <button
                  type="button"
                  className="flex w-full items-start gap-3 text-left"
                  onClick={() =>
                    router.push(`/institution/departments/${department.id}`)
                  }
                >
                  <NodeIcon tone="blue">
                    <Building2 className="size-4" />
                  </NodeIcon>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-[#0F172A]">
                        {department.name}
                      </h3>
                      <span className="rounded-full bg-white px-2.5 py-1 text-xs text-slate-500">
                        {department.code}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-500">
                      HOD: {department.hod_name || "N/A"} ·{" "}
                      {department.student_count ?? 0} students
                    </p>
                  </div>
                </button>

                <div className="ml-5 mt-4 space-y-3 border-l border-slate-200 pl-5">
                  {departmentPrograms.length ? (
                    departmentPrograms.map((program) => {
                      const programBatches = batches.filter(
                        (batch) => batch.program_name === program.name,
                      );

                      return (
                        <div key={program.id} className="space-y-3">
                          <TreeNode
                            icon={<GraduationCap className="size-4" />}
                            title={program.name}
                            onClick={() =>
                              router.push(`/institution/programs/${program.id}`)
                            }
                            meta={`${program.degree_name} · ${program.duration_semesters} semesters`}
                          />

                          <div className="ml-5 space-y-2 border-l border-slate-200 pl-5">
                            {programBatches.length ? (
                              programBatches.map((batch) => {
                                const batchSections = sections.filter(
                                  (section) => section.batch_name === batch.name,
                                );

                                return (
                                  <div key={batch.id} className="space-y-2">
                                    <TreeNode
                                      icon={<Layers3 className="size-4" />}
                                      title={batch.name}
                                      onClick={() =>
                                        router.push(`/institution/batches/${batch.id}`)
                                      }
                                      meta={`${batch.start_year}-${batch.end_year} · ${batch.status}`}
                                      compact
                                    />
                                    <div className="ml-5 flex flex-wrap gap-2 border-l border-slate-200 pl-5">
                                      {batchSections.length ? (
                                        batchSections.map((section) => (
                                          <button
                                            type="button"
                                            key={section.id}
                                            className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-[#22577A]"
                                            onClick={() =>
                                              router.push(
                                                `/institution/sections/${section.id}`,
                                              )
                                            }
                                          >
                                            <UsersRound className="size-3.5" />
                                            {section.name}
                                          </button>
                                        ))
                                      ) : (
                                        <span className="text-xs text-slate-400">
                                          No sections
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                );
                              })
                            ) : (
                              <span className="text-sm text-slate-400">
                                No batches mapped
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <span className="text-sm text-slate-400">
                      No programs mapped
                    </span>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm text-slate-500">
            No hierarchy data available.
          </div>
        )}
      </div>
    </section>
  );
}

function TreeNode({
  icon,
  title,
  meta,
  compact,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  meta: string;
  compact?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className="flex w-full items-start gap-3 rounded-xl text-left transition hover:bg-white/70"
      onClick={onClick}
    >
      <NodeIcon tone="teal">{icon}</NodeIcon>
      <div>
        <p className={compact ? "text-sm font-semibold text-[#0F172A]" : "font-semibold text-[#0F172A]"}>
          {title}
        </p>
        <p className="text-xs text-slate-500">{meta}</p>
      </div>
    </button>
  );
}

function NodeIcon({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: "blue" | "teal";
}) {
  return (
    <span
      className={
        tone === "blue"
          ? "flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#E7F6F5] text-[#22577A]"
          : "flex size-8 shrink-0 items-center justify-center rounded-xl bg-[#F0FBF6] text-[#38A3A5]"
      }
    >
      {children}
    </span>
  );
}
