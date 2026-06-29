"use client";

import { BookOpen, FolderTree, GraduationCap, Layers3, UsersRound } from "lucide-react";
import { useRouter } from "next/navigation";

import type { AcademicBatch, Program, Section, Subject } from "@/types/institution";

interface ProgramHierarchyViewProps {
  programs: Program[];
  batches: AcademicBatch[];
  sections: Section[];
  subjects: Subject[];
}

export function ProgramHierarchyView({
  programs,
  batches,
  sections,
  subjects,
}: ProgramHierarchyViewProps) {
  const router = useRouter();

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[#E86C0D]">Hierarchy</p>
          <h2 className="mt-1 text-xl font-semibold text-[#0F172A]">
            Program structure tree
          </h2>
        </div>
        <FolderTree className="size-5 text-[#38A3A5]" />
      </div>

      <div className="space-y-4">
        {programs.length ? (
          programs.map((program) => {
            const programBatches = batches.filter(
              (batch) => batch.program_name === program.name,
            );
            const programSubjects = subjects.filter(
              (subject) => subject.program_name === program.name,
            );

            return (
              <div
                key={program.id}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >
                <button
                  type="button"
                  className="flex w-full items-start gap-3 text-left"
                  onClick={() =>
                    router.push(`/institution/programs/${program.id}`)
                  }
                >
                  <NodeIcon tone="blue">
                    <GraduationCap className="size-4" />
                  </NodeIcon>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-[#0F172A]">
                        {program.name}
                      </h3>
                      <span className="rounded-full bg-white px-2.5 py-1 text-xs text-slate-500">
                        {program.code}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-500">
                      {program.department_name} · {program.degree_name} ·{" "}
                      {program.duration_semesters} semesters
                    </p>
                  </div>
                </button>

                <div className="ml-5 mt-4 grid gap-4 border-l border-slate-200 pl-5 lg:grid-cols-2">
                  <div>
                    <TreeNode
                      icon={<Layers3 className="size-4" />}
                      title="Batches"
                      meta={`${programBatches.length} mapped`}
                    />
                    <div className="ml-5 mt-3 space-y-2 border-l border-slate-200 pl-5">
                      {programBatches.length ? (
                        programBatches.map((batch) => {
                          const batchSections = sections.filter(
                            (section) => section.batch_name === batch.name,
                          );

                          return (
                            <div
                              role="link"
                              tabIndex={0}
                              key={batch.id}
                              className="block w-full rounded-xl bg-white p-3 text-left transition hover:ring-1 hover:ring-[#38A3A5]"
                              onClick={() =>
                                router.push(`/institution/batches/${batch.id}`)
                              }
                              onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                  router.push(`/institution/batches/${batch.id}`);
                                }
                              }}
                            >
                              <p className="text-sm font-semibold text-[#0F172A]">
                                {batch.name}
                              </p>
                              <p className="text-xs text-slate-500">
                                {batch.start_year}-{batch.end_year} · {batch.status}
                              </p>
                              <div className="mt-2 flex flex-wrap gap-2">
                                {batchSections.length ? (
                                  batchSections.map((section) => (
                                    <button
                                      type="button"
                                      key={section.id}
                                      className="inline-flex items-center gap-1 rounded-full bg-[#E7F6F5] px-2 py-1 text-xs font-medium text-[#22577A]"
                                      onClick={(event) => {
                                        event.stopPropagation();
                                        router.push(
                                          `/institution/sections/${section.id}`,
                                        );
                                      }}
                                    >
                                      <UsersRound className="size-3" />
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
                        <span className="text-sm text-slate-400">No batches</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <TreeNode
                      icon={<BookOpen className="size-4" />}
                      title="Subjects"
                      meta={`${programSubjects.length} offered`}
                    />
                    <div className="ml-5 mt-3 flex flex-wrap gap-2 border-l border-slate-200 pl-5">
                      {programSubjects.length ? (
                        programSubjects.slice(0, 8).map((subject) => (
                          <span
                            key={subject.id}
                            className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-slate-700"
                          >
                            {subject.name}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-slate-400">No subjects</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm text-slate-500">
            No program hierarchy data available.
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
}: {
  icon: React.ReactNode;
  title: string;
  meta: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <NodeIcon tone="teal">{icon}</NodeIcon>
      <div>
        <p className="font-semibold text-[#0F172A]">{title}</p>
        <p className="text-xs text-slate-500">{meta}</p>
      </div>
    </div>
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
