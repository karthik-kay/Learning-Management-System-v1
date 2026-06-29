"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AssessmentsNav() {
  const pathname = usePathname();

  const isActive = (path: string) =>
    pathname === `/student/assessments/${path}`;

  return (
    <nav className="w-full bg-white border-b">
      <div className="flex items-center gap-8 px-2 sm:px-4">
        {[
          { label: "Tests", path: "tests" },
          { label: "Reports", path: "reports" },
          { label: "Analytics", path: "analytics" },
        ].map((item) => {
          const active = isActive(item.path);

          return (
            <Link
              key={item.path}
              href={`/student/assessments/${item.path}`}
              className={`
                relative py-4 text-sm font-medium transition
                ${
                  active
                    ? "text-orange-600"
                    : "text-gray-600 hover:text-gray-800"
                }
              `}
            >
              {item.label}

              {/* underline highlight */}
              <span
                className={`
                  absolute left-0 right-0 -bottom-px h-0.5 rounded-full transition-all
                  ${active ? "bg-orange-500 w-full" : "bg-transparent w-0"}
                `}
              />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
