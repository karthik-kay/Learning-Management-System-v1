"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Compass, Archive, ShoppingBag } from "lucide-react";

const tabs = [
  {
    label: "My Courses",
    path: "my-courses",
    icon: BookOpen,
  },
  {
    label: "Explore",
    path: "explore",
    icon: Compass,
  },
  {
    label: "Archive",
    path: "archive",
    icon: Archive,
  },
  {
    label: "Purchases",
    path: "purchases",
    icon: ShoppingBag,
  },
];

export default function CoursesNav() {
  const pathname = usePathname();

  const isActive = (path: string) =>
    pathname.startsWith(`/student/courses/${path}`);

  return (
    <nav className="w-full bg-white border-b rounded-t-xl">
      <div className="flex items-center gap-8 px-2 sm:px-4">
        {tabs.map((tab) => {
          const active = isActive(tab.path);
          const Icon = tab.icon;

          return (
            <Link
              key={tab.path}
              href={`/student/courses/${tab.path}`}
              className={`
                relative py-4 text-sm font-medium transition flex items-center gap-2
                ${
                  active
                    ? "text-orange-600"
                    : "text-gray-600 hover:text-gray-800"
                }
              `}
            >
              <Icon
                className={`h-4 w-4 ${
                  active ? "text-orange-600" : "text-gray-500"
                }`}
              />

              <span>{tab.label}</span>

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
