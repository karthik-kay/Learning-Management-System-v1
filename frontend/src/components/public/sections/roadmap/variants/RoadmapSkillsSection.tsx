import { PublicRoadmapDetailData } from "../roadmapData";

interface RoadmapSkillsSectionProps {
  roadmap: PublicRoadmapDetailData;
}

export function RoadmapSkillsSection({ roadmap }: RoadmapSkillsSectionProps) {
  const groupedSkills = groupSkills(roadmap.skills, roadmap.tools);

  return (
    <section className="py-20">
      <div className="rounded-3xl border border-[#E9EAF0] bg-white p-7 shadow-[0_24px_80px_rgba(15,23,42,0.06)] md:p-9">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#38A3A5]">
          Skills
        </p>
        <h2 className="mt-3 text-3xl font-black text-[#0F172A] md:text-4xl">
          Skills you will build on this path
        </h2>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {groupedSkills.map((group) => (
            <article key={group.label} className="rounded-2xl bg-[#F9FAFB] p-5">
              <h3 className="font-black text-[#0F172A]">{group.label}</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-white px-3 py-1 text-xs font-bold text-[#22577A]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function groupSkills(skills: string[], tools: string[]) {
  const languageKeywords = ["python", "javascript", "typescript", "sql", "java", "html", "css"];
  const frameworkKeywords = ["react", "next", "django", "node", "express", "tensorflow", "fastapi"];
  const lower = (value: string) => value.toLowerCase();
  const languages = skills.filter((skill) =>
    languageKeywords.some((keyword) => lower(skill).includes(keyword)),
  );
  const frameworks = skills.filter((skill) =>
    frameworkKeywords.some((keyword) => lower(skill).includes(keyword)),
  );
  const remaining = skills.filter(
    (skill) => !languages.includes(skill) && !frameworks.includes(skill),
  );

  return [
    { label: "Languages", items: languages.length ? languages : skills.slice(0, 3) },
    { label: "Frameworks", items: frameworks.length ? frameworks : skills.slice(3, 6) },
    { label: "Tools", items: tools.length ? tools : ["Git", "Docker", "Cloud"] },
    {
      label: "Soft skills",
      items: remaining.length ? remaining.slice(0, 5) : ["Problem solving", "Debugging", "Communication"],
    },
  ].filter((group) => group.items.length);
}
