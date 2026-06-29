import { Code2, Trophy } from "lucide-react";

interface ProjectMilestonesProps {
  projects?: string[];
}

const fallbackProjects = [
  "Build a domain portfolio case study",
  "Ship one deployable capstone project",
  "Prepare an interview walkthrough for every major decision",
];

export function ProjectMilestones({ projects }: ProjectMilestonesProps) {
  const visibleProjects = projects?.length ? projects : fallbackProjects;

  return (
    <section className="py-20">
      <div className="rounded-3xl bg-[#0F172A] p-7 text-white md:p-10">
        <div className="grid gap-8 lg:grid-cols-[340px_1fr] lg:items-start">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#57CC99]">
              <Trophy className="size-4" />
              Proof of work
            </span>
            <h2 className="mt-4 text-3xl font-black leading-tight md:text-4xl">
              Milestones that make the roadmap visible.
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#E9EAF0]">
              A roadmap only works if learners can prove progress. These
              milestones become portfolio stories, interview examples, and
              mentor review checkpoints.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {visibleProjects.slice(0, 6).map((project, index) => (
              <article
                key={`${project}-${index}`}
                className="rounded-2xl border border-white/10 bg-white/[0.06] p-5"
              >
                <div className="flex items-center justify-between gap-4">
                  <Code2 className="size-5 text-[#FF7A0E]" />
                  <span className="text-xs font-black text-[#8C94A3]">
                    M{index + 1}
                  </span>
                </div>
                <h3 className="mt-4 text-base font-black leading-6 text-white">
                  {project}
                </h3>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
