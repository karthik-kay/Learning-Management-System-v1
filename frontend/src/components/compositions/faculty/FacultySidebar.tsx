// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import React from "react";

// // Define link shape
// interface NavLink {
//   name: string;
//   href: string;
// }

// // Faculty sidebar navigation links
// const facultyNavLinks: NavLink[] = [
//   { name: "Dashboard", href: "/faculty/dashboard" },
//   { name: "My Courses", href: "/faculty/courses" },
//   { name: "Students", href: "/faculty/students" },
//   { name: "Assignments", href: "/faculty/assignments" },
//   { name: "Reports", href: "/faculty/reports" },
//   { name: "Settings", href: "/faculty/settings" },
//   { name: "Logout", href: "/logout" },
// ];

// export default function FacultySidebar() {
//   const pathname = usePathname();

//   return (
//     <aside className="w-64 bg-slate-800 text-white flex flex-col p-4 shadow-xl">
//       <h3 className="text-2xl font-bold mb-6 text-teal-400">Faculty Panel</h3>

//       <nav className="grow">
//         <ul className="space-y-2">
//           {facultyNavLinks.map((link) => {
//             const isActive = pathname === link.href;

//             return (
//               <li key={link.name}>
//                 <Link
//                   href={link.href}
//                   className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
//                     isActive
//                       ? "bg-teal-600 font-semibold text-white"
//                       : "hover:bg-slate-700 text-gray-300"
//                   }`}
//                 >
//                   {link.name}
//                 </Link>
//               </li>
//             );
//           })}
//         </ul>
//       </nav>

//       <div className="mt-auto pt-4 border-t border-slate-700 text-sm text-gray-400">
//         <p>Faculty v1.0</p>
//       </div>
//     </aside>
//   );
// }

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  CheckSquare,
  BarChart3,
  FileText,
  MessageSquare,
  Calendar,
  Settings,
  LogOut,
  Ticket,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useEffect } from "react";
import { fetchUserProfile } from "@/redux/slices/userSlice";

const nav = [
  {
    section: "MAIN",
    links: [
      { name: "Dashboard", href: "/faculty/dashboard", icon: LayoutDashboard },
      {
        name: "Classes",
        href: "/faculty/classes",
        icon: BookOpen,
        badge: "LIVE",
      },
      { name: "Students", href: "/faculty/students", icon: Users },
      { name: "Attendance", href: "/faculty/attendance", icon: CheckSquare },
    ],
  },
  {
    section: "TEACHING",
    links: [
      { name: "Quizzes & Exams", href: "/faculty/quizzes", icon: CheckSquare },
      { name: "Grades", href: "/faculty/grades", icon: BarChart3 },
      { name: "Resources", href: "/faculty/resources", icon: FileText },
    ],
  },
  {
    section: "COMMS",
    links: [
      {
        name: "Community",
        href: "/faculty/community",
        icon: MessageSquare,
        badge: "11",
      },
      { name: "Schedule", href: "/faculty/schedule", icon: Calendar },
      { name: "Tickets", href: "/faculty/tickets", icon: Ticket }, // 👈 YOUR FEATURE
    ],
  },
];

export default function FacultySidebar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((s) => s.user.profile);

  useEffect(() => {
    if (!currentUser) {
      dispatch(fetchUserProfile());
    }
  }, [currentUser, dispatch]);

  return (
    <aside className="w-64 h-screen bg-[#0b1220] text-white flex flex-col border-r border-[#1e293b]">
      {/* HEADER */}
      <div className="px-5 py-6 border-b border-[#1e293b] flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center font-bold"></div>
        <div>
          <p className="font-semibold text-sm">{currentUser?.username}</p>
        </div>
      </div>

      {/* NAV */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {nav.map((group) => (
          <div key={group.section}>
            <p className="text-[10px] tracking-widest text-gray-500 px-3 mb-2">
              {group.section}
            </p>

            <div className="space-y-1">
              {group.links.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition ${
                      isActive
                        ? "bg-[#1e293b] text-white"
                        : "text-gray-400 hover:bg-[#111827] hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={18} />
                      {item.name}
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                          item.badge === "LIVE"
                            ? "bg-red-500 text-white"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* BOTTOM */}
      <div className="border-t border-[#1e293b] p-4 space-y-3">
        <Link
          href="/faculty/settings"
          className="flex items-center gap-3 text-gray-400 hover:text-white text-sm"
        >
          <Settings size={18} />
          Settings
        </Link>

        <Link
          href="/logout"
          className="flex items-center gap-3 text-gray-400 hover:text-white text-sm"
        >
          <LogOut size={18} />
          Log out
        </Link>

        {/* USER */}
      </div>
    </aside>
  );
}
