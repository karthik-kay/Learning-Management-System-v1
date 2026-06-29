"use client";

type InstitutionRoutePlaceholderProps = {
  title: string;
  description: string;
  eyebrow?: string;
  actions?: string[];
};

export function InstitutionRoutePlaceholder({
  title,
  description,
  eyebrow = "Institution workspace",
  actions = [],
}: InstitutionRoutePlaceholderProps) {
  return (
    <main className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="max-w-3xl space-y-3">
          <p className="text-sm font-medium text-teal-600 dark:text-teal-400">
            {eyebrow}
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            {title}
          </h1>
          <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
            {description}
          </p>
        </div>
      </section>

      {actions.length > 0 && (
        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {actions.map((action) => (
            <div
              key={action}
              className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            >
              {action}
            </div>
          ))}
        </section>
      )}
    </main>
  );
}
