"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchUserProfile } from "@/redux/slices/userSlice";

// ── Types ──────────────────────────────────────────────────────────────────

interface ExperienceEntry {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string;
}

interface EducationEntry {
  id: string;
  degree: string;
  school: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa: string;
}

interface ProjectEntry {
  id: string;
  name: string;
  role: string;
  stack: string;
  startDate: string;
  endDate: string;
  current: boolean;
  link: string;
  description: string;
}

interface ResumeData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
  summary: string;
  experience: ExperienceEntry[];
  education: EducationEntry[];
  projects: ProjectEntry[];
  skills: string; // "Label: skill1, skill2" per line
  certifications: string; // one cert per line → bullet list
  languages: string; // "Lang (Level), Lang (Level)" comma sep
}

interface AIState {
  loading: boolean;
  error: string | null;
}

type TabKey =
  | "basics"
  | "summary"
  | "experience"
  | "projects"
  | "education"
  | "skills"
  | "jd";

// ── Factories ──────────────────────────────────────────────────────────────

const uid = () => Math.random().toString(36).slice(2, 9);

const emptyExp = (): ExperienceEntry => ({
  id: uid(),
  title: "",
  company: "",
  location: "",
  startDate: "",
  endDate: "",
  current: false,
  bullets: "",
});

const emptyEdu = (): EducationEntry => ({
  id: uid(),
  degree: "",
  school: "",
  location: "",
  startDate: "",
  endDate: "",
  gpa: "",
});

const emptyProject = (): ProjectEntry => ({
  id: uid(),
  name: "",
  role: "",
  stack: "",
  startDate: "",
  endDate: "",
  current: false,
  link: "",
  description: "",
});

const emptyResume = (): ResumeData => ({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  location: "",
  linkedin: "",
  website: "",
  summary: "",
  experience: [],
  education: [],
  projects: [],
  skills: "",
  certifications: "",
  languages: "",
});

// ── Render styles ──────────────────────────────────────────────────────────
// Four predefined styles. Every field maps to exactly one style.
// No free-form markdown, no custom styling.

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// bullet-list: each non-empty line → <li>. Strips leading • or - automatically.
function renderBulletList(raw: string): string {
  const lines = raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  if (!lines.length) return "";
  const items = lines
    .map((l) => l.replace(/^[•\-]\s*/, ""))
    .map((l) => `<li style="margin-bottom:2pt;font-size:10pt;">${esc(l)}</li>`)
    .join("");
  return `<ul style="margin:4pt 0 0 16pt;padding:0;">${items}</ul>`;
}

// label-colon: "Frontend: React, Next.js" → <strong>Frontend:</strong> React, Next.js
// Lines without colon render as plain text.
function renderLabelColon(raw: string): string {
  const lines = raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  return lines
    .map((line) => {
      const colonIdx = line.indexOf(":");
      if (colonIdx !== -1) {
        const label = line.slice(0, colonIdx).trim();
        const items = line.slice(colonIdx + 1).trim();
        return `<p style="margin:2pt 0;font-size:10pt;line-height:1.5;"><strong>${esc(label)}:</strong> ${esc(items)}</p>`;
      }
      return `<p style="margin:2pt 0;font-size:10pt;">${esc(line)}</p>`;
    })
    .join("");
}

// paragraph: plain prose, newlines → <br/>
function renderParagraph(raw: string): string {
  return `<p style="font-size:10.5pt;line-height:1.5;">${esc(raw).replace(/\n/g, "<br/>")}</p>`;
}

// chip-list: comma-separated → inline spans
function renderChipList(raw: string): string {
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map(
      (c) =>
        `<span style="display:inline-block;margin:0 6pt 3pt 0;font-size:10pt;">${esc(c)}</span>`,
    )
    .join("");
}

type RenderStyle = "bullet-list" | "label-colon" | "paragraph" | "chip-list";

function renderField(raw: string, style: RenderStyle): string {
  if (!raw.trim()) return "";
  switch (style) {
    case "bullet-list":
      return renderBulletList(raw);
    case "label-colon":
      return renderLabelColon(raw);
    case "paragraph":
      return renderParagraph(raw);
    case "chip-list":
      return renderChipList(raw);
  }
}

// ── Resume HTML builder ────────────────────────────────────────────────────

function buildResumeHTML(data: ResumeData): string {
  const fullName = [data.firstName, data.lastName].filter(Boolean).join(" ");
  const contactParts = [
    data.email,
    data.phone,
    data.location,
    data.linkedin,
    data.website,
  ].filter(Boolean);

  const section = (title: string, body: string) =>
    body.trim()
      ? `
      <div style="margin-bottom:10pt;">
        <div style="font-size:11pt;font-weight:bold;text-transform:uppercase;
          letter-spacing:0.06em;border-bottom:1pt solid #000;
          padding-bottom:2pt;margin-bottom:6pt;">${title}</div>
        ${body}
      </div>`
      : "";

  const expHTML = data.experience
    .filter((e) => e.title || e.company)
    .map((e) => {
      const dates = [e.startDate, e.current ? "Present" : e.endDate]
        .filter(Boolean)
        .join(" – ");
      return `
      <div style="margin-bottom:8pt;">
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="font-weight:bold;font-size:11pt;">${esc(e.title)}</td>
            <td style="text-align:right;font-size:10pt;color:#333;">${esc(dates)}</td>
          </tr>
          <tr>
            <td style="font-size:10pt;font-style:italic;">
              ${esc(e.company)}${e.location ? ` · ${esc(e.location)}` : ""}
            </td>
          </tr>
        </table>
        ${renderField(e.bullets, "bullet-list")}
      </div>`;
    })
    .join("");

  const projHTML = data.projects
    .filter((p) => p.name)
    .map((p) => {
      const dates = [p.startDate, p.current ? "Present" : p.endDate]
        .filter(Boolean)
        .join(" – ");
      return `
      <div style="margin-bottom:8pt;">
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="font-weight:bold;font-size:11pt;">
              ${esc(p.name)}${p.role ? ` <span style="font-weight:normal;font-style:italic;">· ${esc(p.role)}</span>` : ""}
            </td>
            <td style="text-align:right;font-size:10pt;color:#333;">${esc(dates)}</td>
          </tr>
          <tr>
            <td style="font-size:10pt;color:#444;">
              ${p.stack ? `<em>${esc(p.stack)}</em>` : ""}
              ${p.link ? ` &nbsp;|&nbsp; <a href="${esc(p.link)}" style="color:#1a5276;font-size:9pt;">${esc(p.link)}</a>` : ""}
            </td>
          </tr>
        </table>
        ${renderField(p.description, "bullet-list")}
      </div>`;
    })
    .join("");

  const eduHTML = data.education
    .filter((e) => e.degree || e.school)
    .map((e) => {
      const dates = [e.startDate, e.endDate].filter(Boolean).join(" – ");
      return `
      <div style="margin-bottom:6pt;">
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="font-weight:bold;font-size:11pt;">${esc(e.degree)}</td>
            <td style="text-align:right;font-size:10pt;color:#333;">${esc(dates)}</td>
          </tr>
          <tr>
            <td style="font-size:10pt;font-style:italic;">
              ${esc(e.school)}${e.location ? ` · ${esc(e.location)}` : ""}
              ${e.gpa ? ` | GPA: ${esc(e.gpa)}` : ""}
            </td>
          </tr>
        </table>
      </div>`;
    })
    .join("");

  const isEmpty =
    !fullName &&
    !contactParts.length &&
    !data.summary &&
    !expHTML &&
    !projHTML &&
    !eduHTML;

  return `
    <div style="font-family:'Times New Roman',Times,serif;font-size:11pt;
      line-height:1.4;color:#000;padding:0.75in 0.75in;
      max-width:8.5in;margin:0 auto;background:#fff;min-height:11in;">
      ${fullName ? `<h1 style="font-size:16pt;font-weight:bold;text-align:center;margin:0 0 4pt;">${esc(fullName)}</h1>` : ""}
      ${contactParts.length ? `<p style="text-align:center;font-size:10pt;color:#222;margin:0 0 12pt;">${contactParts.map(esc).join(" | ")}</p>` : ""}
      ${data.summary ? section("Professional Summary", renderField(data.summary, "paragraph")) : ""}
      ${expHTML ? section("Work Experience", expHTML) : ""}
      ${projHTML ? section("Projects", projHTML) : ""}
      ${eduHTML ? section("Education", eduHTML) : ""}
      ${data.skills ? section("Skills", renderField(data.skills, "label-colon")) : ""}
      ${data.certifications ? section("Certifications", renderField(data.certifications, "bullet-list")) : ""}
      ${data.languages ? section("Languages", renderField(data.languages, "chip-list")) : ""}
      ${isEmpty ? `<p style="text-align:center;color:#999;margin-top:2in;font-size:11pt;">Fill in your details to see the ATS preview</p>` : ""}
    </div>`;
}

// ── BulletField ────────────────────────────────────────────────────────────
// Simple textarea with bullet helpers. Enter auto-continues bullets.
// Used for experience bullets and project descriptions.

interface BulletFieldProps {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}

function BulletField({
  value,
  onChange,
  rows = 5,
  placeholder,
}: BulletFieldProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const el = ref.current;
    if (!el) return;
    const pos = el.selectionStart;
    const lineStart = value.lastIndexOf("\n", pos - 1) + 1;
    const line = value.slice(lineStart, pos);

    if (e.key === "Enter" && line.trimStart().startsWith("• ")) {
      e.preventDefault();
      if (line.trim() === "• " || line.trim() === "•") {
        // empty bullet — remove it, stop list
        const newVal = value.slice(0, lineStart) + value.slice(pos);
        onChange(newVal);
        setTimeout(() => {
          el.focus();
          el.setSelectionRange(lineStart, lineStart);
        }, 0);
      } else {
        const indent = line.match(/^(\s*)/)?.[1] ?? "";
        const insert = "\n" + indent + "• ";
        const newVal = value.slice(0, pos) + insert + value.slice(pos);
        onChange(newVal);
        setTimeout(() => {
          el.focus();
          el.setSelectionRange(pos + insert.length, pos + insert.length);
        }, 0);
      }
    }
  };

  const addBullet = () => {
    const el = ref.current;
    if (!el) return;
    const pos = el.selectionStart;
    const prefix = value && !value.endsWith("\n") ? "\n" : "";
    const newVal = value.slice(0, pos) + prefix + "• " + value.slice(pos);
    onChange(newVal);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(pos + prefix.length + 2, pos + prefix.length + 2);
    }, 0);
  };

  const btnCls =
    "px-2 py-1 text-[11px] rounded border border-[#2a2f42] text-[#7a8099] hover:text-[#e8ecf5] hover:border-[#4f7cff] transition-colors bg-transparent cursor-pointer";

  return (
    <div>
      <div className="flex gap-1.5 mb-1.5 flex-wrap">
        <button type="button" className={btnCls} onClick={addBullet}>
          + Bullet
        </button>
        <button
          type="button"
          className={btnCls}
          onClick={() =>
            onChange(
              value
                .split("\n")
                .map((l) =>
                  l.trim()
                    ? l.trim().startsWith("• ")
                      ? l
                      : "• " + l.trimStart()
                    : l,
                )
                .join("\n"),
            )
          }
        >
          Bullet all lines
        </button>
        <button
          type="button"
          className={btnCls}
          onClick={() => onChange(value.replace(/^\s*•\s*/gm, ""))}
        >
          Clear bullets
        </button>
      </div>
      <textarea
        ref={ref}
        className="w-full bg-[#0f1117] border border-[#2a2f42] rounded-md px-3 py-2 text-sm text-[#e8ecf5] placeholder-[#4a5068] focus:outline-none focus:border-[#4f7cff] transition-colors resize-y font-mono"
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        spellCheck
      />
      <p className="text-[10px] text-[#4a5068] mt-1">
        Enter auto-continues bullets · Backspace on empty bullet exits list
      </p>
    </div>
  );
}

// ── SkillsField ────────────────────────────────────────────────────────────
// Each line: "Category: skill1, skill2, skill3"
// Preset buttons inject a category line at cursor.

interface SkillsFieldProps {
  value: string;
  onChange: (v: string) => void;
}

function SkillsField({ value, onChange }: SkillsFieldProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

  const addCategory = (label: string) => {
    const prefix = value && !value.endsWith("\n") ? "\n" : "";
    const insert = prefix + label + ": ";
    onChange(value + insert);
    setTimeout(() => {
      const el = ref.current;
      if (el) {
        el.focus();
        el.setSelectionRange(el.value.length, el.value.length);
      }
    }, 0);
  };

  const presets = [
    "Frontend",
    "Backend",
    "Database",
    "DevOps",
    "Tools",
    "Mobile",
    "Testing",
    "Cloud",
  ];
  const btnCls =
    "px-2 py-1 text-[11px] rounded border border-[#2a2f42] text-[#7a8099] hover:text-[#4f7cff] hover:border-[#4f7cff] transition-colors bg-transparent cursor-pointer whitespace-nowrap";

  return (
    <div>
      <p className="text-[11px] text-[#4a5068] mb-2">
        Format:{" "}
        <span className="font-mono text-[#7a8099]">
          Category: skill1, skill2, skill3
        </span>
        &nbsp;— the label before <span className="font-mono">:</span> renders{" "}
        <strong className="text-[#c8cedd]">bold</strong> in the resume. Lines
        without <span className="font-mono">:</span> render as plain text.
      </p>
      <div className="flex flex-wrap gap-1 mb-2">
        {presets.map((p) => (
          <button
            key={p}
            type="button"
            className={btnCls}
            onClick={() => addCategory(p)}
          >
            + {p}
          </button>
        ))}
      </div>
      <textarea
        ref={ref}
        className="w-full bg-[#0f1117] border border-[#2a2f42] rounded-md px-3 py-2 text-sm text-[#e8ecf5] placeholder-[#4a5068] focus:outline-none focus:border-[#4f7cff] transition-colors resize-y font-mono"
        rows={7}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={
          "Frontend: React, Next.js, TypeScript, Tailwind\nBackend: Django, Node.js, PostgreSQL, Redis\nDevOps: Docker, GitHub Actions, Render\nTools: Figma, VS Code, Postman"
        }
        spellCheck={false}
      />
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────

export default function ATSResumeBuilder() {
  const dispatch = useAppDispatch();
  const { profile, status } = useAppSelector((state) => state.user);

  const [resume, setResume] = useState<ResumeData>(emptyResume());
  const [activeTab, setActiveTab] = useState<TabKey>("basics");
  const [jobDescription, setJobDescription] = useState("");
  const [ai, setAi] = useState<AIState>({ loading: false, error: null });
  const [aiSuggestions, setAiSuggestions] = useState<{
    summary: string;
    skills: string;
  } | null>(null);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const previewRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (status === "idle") dispatch(fetchUserProfile());
  }, [dispatch, status]);

  useEffect(() => {
    if (profile) {
      setResume((prev) => ({
        ...prev,
        firstName: profile.first_name ?? "",
        lastName: profile.last_name ?? "",
        email: profile.email ?? "",
        phone: profile.phone_number ?? "",
      }));
    }
  }, [profile]);

  useEffect(() => {
    const iframe = previewRef.current;
    if (!iframe) return;
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;
    doc.open();
    doc.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"/>
      <style>*{margin:0;padding:0;box-sizing:border-box;}body{background:#fff;}</style>
      </head><body>${buildResumeHTML(resume)}</body></html>`);
    doc.close();
  }, [resume]);

  const setField = useCallback(
    <K extends keyof ResumeData>(key: K, value: ResumeData[K]) => {
      setResume((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const setExpField = useCallback(
    <K extends keyof ExperienceEntry>(
      id: string,
      key: K,
      value: ExperienceEntry[K],
    ) => {
      setResume((prev) => ({
        ...prev,
        experience: prev.experience.map((e) =>
          e.id === id ? { ...e, [key]: value } : e,
        ),
      }));
    },
    [],
  );

  const setEduField = useCallback(
    <K extends keyof EducationEntry>(
      id: string,
      key: K,
      value: EducationEntry[K],
    ) => {
      setResume((prev) => ({
        ...prev,
        education: prev.education.map((e) =>
          e.id === id ? { ...e, [key]: value } : e,
        ),
      }));
    },
    [],
  );

  const setProjField = useCallback(
    <K extends keyof ProjectEntry>(
      id: string,
      key: K,
      value: ProjectEntry[K],
    ) => {
      setResume((prev) => ({
        ...prev,
        projects: prev.projects.map((p) =>
          p.id === id ? { ...p, [key]: value } : p,
        ),
      }));
    },
    [],
  );

  // ── AI ───────────────────────────────────────────────────────────────────

  const handleAISuggest = async () => {
    if (!jobDescription.trim()) return;
    setAi({ loading: true, error: null });
    setAiSuggestions(null);
    try {
      const prompt = `You are an expert ATS resume writer.

Job description:
"""
${jobDescription}
"""

Candidate:
Name: ${resume.firstName} ${resume.lastName}
Skills: ${resume.skills}
Experience: ${resume.experience.map((e) => `${e.title} at ${e.company}`).join(", ")}

Return ONLY a JSON object, no markdown, no explanation:
{
  "summary": "3-sentence ATS-optimized summary using keywords from the JD",
  "skills": "Skills as label-colon groups, one per line, e.g. Frontend: React, TypeScript\\nBackend: Node.js, Django"
}`;

      const res = await fetch("/api/ai/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      if (!res.ok) throw new Error("AI request failed");
      const data = await res.json();
      const cleaned = data.text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      setAiSuggestions(parsed);
      setAi({ loading: false, error: null });
    } catch {
      setAi({
        loading: false,
        error: "AI suggestion failed. Check your API key or try again.",
      });
    }
  };

  const applyAISuggestions = () => {
    if (!aiSuggestions) return;
    setResume((prev) => ({
      ...prev,
      summary: aiSuggestions.summary || prev.summary,
      skills: aiSuggestions.skills || prev.skills,
    }));
    setAiSuggestions(null);
    setActiveTab("summary");
  };

  // ── Save / Download ──────────────────────────────────────────────────────

  const handleSave = async () => {
    setSaveStatus("saving");
    try {
      const res = await fetch("/api/resumes/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume, userId: profile?.id }),
      });
      if (!res.ok) throw new Error();
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
  };

  const handleDownload = () => {
    const fullName =
      [resume.firstName, resume.lastName].filter(Boolean).join("_") || "resume";
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"/><title>${fullName} Resume</title>
      <style>*{margin:0;padding:0;box-sizing:border-box;}body{background:#fff;}
      @page{size:letter;margin:0;}@media print{html,body{width:8.5in;}}</style>
      </head><body>${buildResumeHTML(resume)}</body></html>`;
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 500);
  };

  // ── Shared class strings ─────────────────────────────────────────────────

  const inputCls =
    "w-full bg-[#0f1117] border border-[#2a2f42] rounded-md px-3 py-2 text-sm text-[#e8ecf5] placeholder-[#4a5068] focus:outline-none focus:border-[#4f7cff] transition-colors";
  const labelCls =
    "block text-xs font-medium text-[#7a8099] mb-1 uppercase tracking-wide";
  const textareaCls = `${inputCls} resize-y`;
  const addRowBtnCls =
    "w-full border border-dashed border-[#2a2f42] rounded-lg py-2 text-sm text-[#7a8099] hover:border-[#4f7cff] hover:text-[#4f7cff] transition-colors";
  const entryCardCls =
    "border border-[#2a2f42] rounded-lg p-3 space-y-3 relative";
  const removeXCls =
    "absolute top-2 right-2 text-[#4a5068] hover:text-[#ff5f57] text-lg leading-none transition-colors";

  // ── Tab content ──────────────────────────────────────────────────────────

  const renderTab = () => {
    switch (activeTab) {
      case "basics":
        return (
          <div className="space-y-4">
            {status === "loading" && (
              <div className="text-xs text-[#4f7cff] bg-[#4f7cff15] border border-[#4f7cff33] rounded-md px-3 py-2">
                Fetching your profile...
              </div>
            )}
            {status === "succeeded" && (
              <div className="text-xs text-[#2ecf8a] bg-[#2ecf8a15] border border-[#2ecf8a33] rounded-md px-3 py-2">
                Profile autofilled. Add any missing fields.
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>First name</label>
                <input
                  className={inputCls}
                  value={resume.firstName}
                  onChange={(e) => setField("firstName", e.target.value)}
                  placeholder="Jane"
                />
              </div>
              <div>
                <label className={labelCls}>Last name</label>
                <input
                  className={inputCls}
                  value={resume.lastName}
                  onChange={(e) => setField("lastName", e.target.value)}
                  placeholder="Smith"
                />
              </div>
            </div>
            <div>
              <label className={labelCls}>Email</label>
              <input
                className={inputCls}
                value={resume.email}
                onChange={(e) => setField("email", e.target.value)}
                placeholder="jane@email.com"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Phone</label>
                <input
                  className={inputCls}
                  value={resume.phone}
                  onChange={(e) => setField("phone", e.target.value)}
                  placeholder="+91 98765 43210"
                />
              </div>
              <div>
                <label className={labelCls}>Location</label>
                <input
                  className={inputCls}
                  value={resume.location}
                  onChange={(e) => setField("location", e.target.value)}
                  placeholder="Ongole, AP"
                />
              </div>
            </div>
            <div>
              <label className={labelCls}>LinkedIn</label>
              <input
                className={inputCls}
                value={resume.linkedin}
                onChange={(e) => setField("linkedin", e.target.value)}
                placeholder="linkedin.com/in/jane"
              />
            </div>
            <div>
              <label className={labelCls}>Website / Portfolio</label>
              <input
                className={inputCls}
                value={resume.website}
                onChange={(e) => setField("website", e.target.value)}
                placeholder="janesmith.dev"
              />
            </div>
          </div>
        );

      case "summary":
        return (
          <div className="space-y-3">
            <p className="text-xs text-[#7a8099]">
              2–4 sentences. Use keywords from the target job description
              naturally.
            </p>
            <div>
              <label className={labelCls}>Professional summary</label>
              <textarea
                className={textareaCls}
                rows={7}
                value={resume.summary}
                onChange={(e) => setField("summary", e.target.value)}
                placeholder="Results-driven full stack developer with 2+ years building enterprise-grade products..."
              />
            </div>
          </div>
        );

      case "experience":
        return (
          <div className="space-y-4">
            <p className="text-xs text-[#7a8099]">
              Start each bullet with an action verb. Include numbers and
              metrics.
            </p>
            {resume.experience.map((exp) => (
              <div key={exp.id} className={entryCardCls}>
                <button
                  onClick={() =>
                    setResume((p) => ({
                      ...p,
                      experience: p.experience.filter((e) => e.id !== exp.id),
                    }))
                  }
                  className={removeXCls}
                >
                  ×
                </button>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Job title</label>
                    <input
                      className={inputCls}
                      value={exp.title}
                      onChange={(e) =>
                        setExpField(exp.id, "title", e.target.value)
                      }
                      placeholder="Full Stack Developer"
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Company</label>
                    <input
                      className={inputCls}
                      value={exp.company}
                      onChange={(e) =>
                        setExpField(exp.id, "company", e.target.value)
                      }
                      placeholder="Acme Corp"
                    />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Location</label>
                  <input
                    className={inputCls}
                    value={exp.location}
                    onChange={(e) =>
                      setExpField(exp.id, "location", e.target.value)
                    }
                    placeholder="Remote / Hyderabad"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Start date</label>
                    <input
                      className={inputCls}
                      value={exp.startDate}
                      onChange={(e) =>
                        setExpField(exp.id, "startDate", e.target.value)
                      }
                      placeholder="Jan 2023"
                    />
                  </div>
                  <div>
                    <label className={labelCls}>End date</label>
                    <input
                      className={inputCls}
                      value={exp.endDate}
                      onChange={(e) =>
                        setExpField(exp.id, "endDate", e.target.value)
                      }
                      placeholder="Present"
                      disabled={exp.current}
                    />
                  </div>
                </div>
                <label className="flex items-center gap-2 text-xs text-[#7a8099] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={exp.current}
                    className="accent-[#4f7cff]"
                    onChange={(e) => {
                      setExpField(exp.id, "current", e.target.checked);
                      if (e.target.checked) setExpField(exp.id, "endDate", "");
                    }}
                  />
                  Currently working here
                </label>
                <div>
                  <label className={labelCls}>Bullet points</label>
                  <BulletField
                    value={exp.bullets}
                    onChange={(v) => setExpField(exp.id, "bullets", v)}
                    rows={5}
                    placeholder={
                      "• Led migration to microservices, reducing API latency by 40%\n• Built RBAC system covering 6 user roles across 3 dashboards"
                    }
                  />
                </div>
              </div>
            ))}
            <button
              onClick={() =>
                setResume((p) => ({
                  ...p,
                  experience: [...p.experience, emptyExp()],
                }))
              }
              className={addRowBtnCls}
            >
              + Add experience
            </button>
          </div>
        );

      case "projects":
        return (
          <div className="space-y-4">
            <p className="text-xs text-[#7a8099]">
              Stack and link appear as a subtitle. Description renders as bullet
              list.
            </p>
            {resume.projects.map((proj) => (
              <div key={proj.id} className={entryCardCls}>
                <button
                  onClick={() =>
                    setResume((p) => ({
                      ...p,
                      projects: p.projects.filter((x) => x.id !== proj.id),
                    }))
                  }
                  className={removeXCls}
                >
                  ×
                </button>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Project name</label>
                    <input
                      className={inputCls}
                      value={proj.name}
                      onChange={(e) =>
                        setProjField(proj.id, "name", e.target.value)
                      }
                      placeholder="Vaarada LMS"
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Your role</label>
                    <input
                      className={inputCls}
                      value={proj.role}
                      onChange={(e) =>
                        setProjField(proj.id, "role", e.target.value)
                      }
                      placeholder="Solo Developer"
                    />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Tech stack</label>
                  <input
                    className={inputCls}
                    value={proj.stack}
                    onChange={(e) =>
                      setProjField(proj.id, "stack", e.target.value)
                    }
                    placeholder="Django, Next.js, PostgreSQL, Redis, Node.js"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Start date</label>
                    <input
                      className={inputCls}
                      value={proj.startDate}
                      onChange={(e) =>
                        setProjField(proj.id, "startDate", e.target.value)
                      }
                      placeholder="Jun 2024"
                    />
                  </div>
                  <div>
                    <label className={labelCls}>End date</label>
                    <input
                      className={inputCls}
                      value={proj.endDate}
                      onChange={(e) =>
                        setProjField(proj.id, "endDate", e.target.value)
                      }
                      placeholder="Present"
                      disabled={proj.current}
                    />
                  </div>
                </div>
                <label className="flex items-center gap-2 text-xs text-[#7a8099] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={proj.current}
                    className="accent-[#4f7cff]"
                    onChange={(e) => {
                      setProjField(proj.id, "current", e.target.checked);
                      if (e.target.checked)
                        setProjField(proj.id, "endDate", "");
                    }}
                  />
                  Ongoing / in progress
                </label>
                <div>
                  <label className={labelCls}>GitHub / Live link</label>
                  <input
                    className={inputCls}
                    value={proj.link}
                    onChange={(e) =>
                      setProjField(proj.id, "link", e.target.value)
                    }
                    placeholder="github.com/yourname/project"
                  />
                </div>
                <div>
                  <label className={labelCls}>Description</label>
                  <BulletField
                    value={proj.description}
                    onChange={(v) => setProjField(proj.id, "description", v)}
                    rows={5}
                    placeholder={
                      "• Enterprise LMS for 500+ students with 4 role-based dashboards\n• Built solo in 6 months: Django REST API, Next.js frontend, Jitsi live classes\n• Integrated Monaco Editor + Judge0 for in-browser code execution"
                    }
                  />
                </div>
              </div>
            ))}
            <button
              onClick={() =>
                setResume((p) => ({
                  ...p,
                  projects: [...p.projects, emptyProject()],
                }))
              }
              className={addRowBtnCls}
            >
              + Add project
            </button>
          </div>
        );

      case "education":
        return (
          <div className="space-y-4">
            {resume.education.map((edu) => (
              <div key={edu.id} className={entryCardCls}>
                <button
                  onClick={() =>
                    setResume((p) => ({
                      ...p,
                      education: p.education.filter((e) => e.id !== edu.id),
                    }))
                  }
                  className={removeXCls}
                >
                  ×
                </button>
                <div>
                  <label className={labelCls}>Degree / qualification</label>
                  <input
                    className={inputCls}
                    value={edu.degree}
                    onChange={(e) =>
                      setEduField(edu.id, "degree", e.target.value)
                    }
                    placeholder="B.Tech Computer Science"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Institution</label>
                    <input
                      className={inputCls}
                      value={edu.school}
                      onChange={(e) =>
                        setEduField(edu.id, "school", e.target.value)
                      }
                      placeholder="JNTU Kakinada"
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Location</label>
                    <input
                      className={inputCls}
                      value={edu.location}
                      onChange={(e) =>
                        setEduField(edu.id, "location", e.target.value)
                      }
                      placeholder="Kakinada, AP"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className={labelCls}>Start</label>
                    <input
                      className={inputCls}
                      value={edu.startDate}
                      onChange={(e) =>
                        setEduField(edu.id, "startDate", e.target.value)
                      }
                      placeholder="2018"
                    />
                  </div>
                  <div>
                    <label className={labelCls}>End</label>
                    <input
                      className={inputCls}
                      value={edu.endDate}
                      onChange={(e) =>
                        setEduField(edu.id, "endDate", e.target.value)
                      }
                      placeholder="2022"
                    />
                  </div>
                  <div>
                    <label className={labelCls}>GPA / %</label>
                    <input
                      className={inputCls}
                      value={edu.gpa}
                      onChange={(e) =>
                        setEduField(edu.id, "gpa", e.target.value)
                      }
                      placeholder="7.8"
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={() =>
                setResume((p) => ({
                  ...p,
                  education: [...p.education, emptyEdu()],
                }))
              }
              className={addRowBtnCls}
            >
              + Add education
            </button>
          </div>
        );

      case "skills":
        return (
          <div className="space-y-5">
            <div>
              <label className={labelCls}>Skills</label>
              <SkillsField
                value={resume.skills}
                onChange={(v) => setField("skills", v)}
              />
            </div>
            <div>
              <label className={labelCls}>Languages</label>
              <p className="text-[11px] text-[#4a5068] mb-2">
                Comma-separated —{" "}
                <span className="font-mono text-[#7a8099]">
                  Telugu (Native), English (Fluent)
                </span>
              </p>
              <input
                className={inputCls}
                value={resume.languages}
                onChange={(e) => setField("languages", e.target.value)}
                placeholder="Telugu (Native), English (Fluent), Hindi (Conversational)"
              />
            </div>
            <div>
              <label className={labelCls}>Certifications</label>
              <p className="text-[11px] text-[#4a5068] mb-2">
                One per line — rendered as bullet list in resume.
              </p>
              <textarea
                className={textareaCls}
                rows={4}
                value={resume.certifications}
                onChange={(e) => setField("certifications", e.target.value)}
                placeholder={
                  "AWS Solutions Architect – Associate, 2023\nMeta Frontend Developer Certificate, 2022\nGoogle Analytics Certified"
                }
              />
            </div>
          </div>
        );

      case "jd":
        return (
          <div className="space-y-4">
            <p className="text-xs text-[#7a8099]">
              Paste a job description — Claude generates a tailored summary and
              skill groups in label:colon format ready to apply.
            </p>
            <div>
              <label className={labelCls}>Job description</label>
              <textarea
                className={textareaCls}
                rows={10}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the full job description here..."
              />
            </div>
            <button
              onClick={handleAISuggest}
              disabled={ai.loading || !jobDescription.trim()}
              className="w-full py-2.5 rounded-lg text-sm font-medium bg-[#4f7cff] text-white hover:bg-[#3d6be8] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {ai.loading ? (
                <>
                  <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />{" "}
                  Generating...
                </>
              ) : (
                "✦ Generate ATS suggestions"
              )}
            </button>
            {ai.error && (
              <p className="text-xs text-[#ff5f57] bg-[#ff5f5715] border border-[#ff5f5733] rounded-md px-3 py-2">
                {ai.error}
              </p>
            )}
            {aiSuggestions && (
              <div className="border border-[#2ecf8a33] bg-[#2ecf8a08] rounded-lg p-4 space-y-3">
                <p className="text-xs font-medium text-[#2ecf8a] uppercase tracking-wide">
                  AI suggestions ready
                </p>
                <div>
                  <p className="text-xs text-[#7a8099] mb-1">Summary</p>
                  <p className="text-sm text-[#c8cedd] leading-relaxed">
                    {aiSuggestions.summary}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#7a8099] mb-1">
                    Skills (label:colon groups)
                  </p>
                  <pre className="text-sm text-[#c8cedd] font-mono whitespace-pre-wrap leading-relaxed">
                    {aiSuggestions.skills}
                  </pre>
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={applyAISuggestions}
                    className="flex-1 py-2 rounded-lg text-sm font-medium bg-[#2ecf8a] text-[#0f1117] hover:bg-[#26b87a] transition-colors"
                  >
                    Apply to resume
                  </button>
                  <button
                    onClick={() => setAiSuggestions(null)}
                    className="px-4 py-2 rounded-lg text-sm text-[#7a8099] border border-[#2a2f42] hover:border-[#353b52] transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}
          </div>
        );
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────

  const tabs: { key: TabKey; label: string }[] = [
    { key: "basics", label: "Basics" },
    { key: "summary", label: "Summary" },
    { key: "experience", label: "Experience" },
    { key: "projects", label: "Projects" },
    { key: "education", label: "Education" },
    { key: "skills", label: "Skills" },
    { key: "jd", label: "✦ AI" },
  ];

  const score = atsScore(resume);

  return (
    <div className="flex flex-col h-screen bg-[#0f1117] text-[#e8ecf5] font-sans">
      <header className="flex items-center justify-between px-6 h-[54px] border-b border-[#2a2f42] bg-[#181c27] shrink-0">
        <div className="text-[15px] font-semibold tracking-tight">
          <span className="text-[#f9a11e]">Vaarada </span>Resume Builder
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            disabled={saveStatus === "saving"}
            className="px-3 py-1.5 text-xs rounded-md border border-[#2a2f42] text-[#a0a8bf] hover:border-[#353b52] hover:text-[#e8ecf5] transition-colors disabled:opacity-50"
          >
            {saveStatus === "saving"
              ? "Saving..."
              : saveStatus === "saved"
                ? "✓ Saved"
                : saveStatus === "error"
                  ? "Save failed"
                  : "Save"}
          </button>
          <button
            onClick={handleDownload}
            className="px-3 py-1.5 text-xs rounded-md bg-[#4f7cff] text-white hover:bg-[#3d6be8] transition-colors font-medium"
          >
            Download PDF
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Form panel */}
        <div className="w-[420px] shrink-0 flex flex-col border-r border-[#2a2f42] bg-[#181c27]">
          <div className="flex border-b border-[#2a2f42] px-2 pt-2 gap-0.5 shrink-0 overflow-x-auto">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`px-3 py-2 text-xs font-medium rounded-t-md whitespace-nowrap transition-colors
                  ${
                    activeTab === t.key
                      ? "text-[#e8ecf5] bg-[#0f1117] border border-b-0 border-[#2a2f42]"
                      : "text-[#7a8099] hover:text-[#a0a8bf]"
                  }
                  ${t.key === "jd" ? "!text-[#4f7cff]" : ""}`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto p-4">{renderTab()}</div>
          {/* ATS score bar */}
          <div className="border-t border-[#2a2f42] px-4 py-3 shrink-0">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs text-[#7a8099]">ATS completeness</span>
              <span className="text-xs font-medium text-[#e8ecf5]">
                {score}%
              </span>
            </div>
            <div className="h-1.5 bg-[#2a2f42] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${score}%`,
                  background:
                    score >= 80
                      ? "#2ecf8a"
                      : score >= 50
                        ? "#f5a623"
                        : "#4f7cff",
                }}
              />
            </div>
          </div>
        </div>

        {/* Preview panel */}
        <div className="flex-1 flex flex-col bg-[#0f1117] overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 border-b border-[#2a2f42] shrink-0">
            <span className="text-xs text-[#7a8099] uppercase tracking-wide">
              ATS Preview · Times New Roman · 11pt · Standard margins
            </span>
            <span className="text-xs text-[#4a5068]">
              How an ATS parser sees your resume
            </span>
          </div>
          <div className="flex-1 overflow-auto p-6">
            <div
              className="shadow-2xl rounded-sm"
              style={{ maxWidth: "816px", margin: "0 auto" }}
            >
              <iframe
                ref={previewRef}
                title="Resume Preview"
                className="w-full bg-white rounded-sm"
                style={{ height: "1056px", border: "none" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── ATS completeness score ─────────────────────────────────────────────────

function atsScore(r: ResumeData): number {
  let s = 0;
  if (r.firstName || r.lastName) s += 10;
  if (r.email) s += 10;
  if (r.phone) s += 5;
  if (r.location) s += 5;
  if (r.summary && r.summary.length > 50) s += 15;
  if (r.experience.length > 0) s += 15;
  if (r.experience.some((e) => e.bullets.trim().length > 20)) s += 10;
  if (r.projects.length > 0) s += 5;
  if (r.education.length > 0) s += 10;
  if (r.skills && r.skills.split("\n").some((l) => l.includes(":"))) s += 10;
  if (r.certifications.trim()) s += 5;
  return Math.min(s, 100);
}
