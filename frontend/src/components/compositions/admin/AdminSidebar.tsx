// // src/components/AdminSidebar.tsx
// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import React from "react";

// // Define the shape of a single link object
// interface NavLink {
//   name: string;
//   href: string;
// }

// // 1. Define the Navigation Links
// const adminNavLinks: NavLink[] = [
//   { name: "Dashboard", href: "/admin/dashboard" },
//   { name: "Manage Users", href: "/admin/users" },
//   { name: "System Settings", href: "/admin/settings" },
//   { name: "Logout", href: "/logout" }, // Example external link/action
// ];

// export default function AdminSidebar() {
//   // Get the current URL path to highlight the active link
//   const pathname = usePathname();

//   return (
//     <aside className="w-64 bg-gray-800 text-white flex flex-col p-4 shadow-xl">
//       <h3 className="text-2xl font-bold mb-6 text-indigo-400">Admin Panel</h3>

//       <nav className="grow">
//         <ul className="space-y-2">
//           {adminNavLinks.map((link) => {
//             // Check if the current link's href matches the current pathname
//             const isActive = pathname === link.href;

//             return (
//               <li key={link.name}>
//                 <Link
//                   href={link.href}
//                   className={`
//                     flex items-center p-3 rounded-lg transition-colors duration-200
//                     ${
//                       isActive
//                         ? "bg-indigo-600 font-semibold text-white" // Active style
//                         : "hover:bg-gray-700 text-gray-300" // Inactive style
//                     }
//                   `}
//                 >
//                   {link.name}
//                 </Link>
//               </li>
//             );
//           })}
//         </ul>
//       </nav>

//       <div className="mt-auto pt-4 border-t border-gray-700 text-sm text-gray-400">
//         <p>Admin v1.0</p>
//       </div>
//     </aside>
//   );
// }

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  BarChart3,
  Users,
  Shield,
  Building,
  BookOpen,
  Layers,
  DollarSign,
  Gift,
  Award,
  Bell,
  FileText,
  Settings,
  Ticket,
} from "lucide-react";

const nav = [
  {
    section: "OVERVIEW",
    items: [
      { name: "Dashboard", href: "/admin/dashboard", icon: Home },
      { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    ],
  },
  {
    section: "PEOPLE",
    items: [
      { name: "Users", href: "/admin/users", icon: Users, badge: "2" },
      { name: "Roles & Permissions", href: "/admin/roles", icon: Shield },
    ],
  },
  {
    section: "PLATFORM",
    items: [
      { name: "Institutions", href: "/admin/institutions", icon: Building },
      { name: "Courses", href: "/admin/courses", icon: BookOpen },
      { name: "Workspaces", href: "/admin/workspaces", icon: Layers },
    ],
  },
  {
    section: "FINANCE",
    items: [
      { name: "Payments", href: "/admin/payments", icon: DollarSign },
      { name: "Bounties", href: "/admin/bounties", icon: Gift },
      { name: "Certifications", href: "/admin/certifications", icon: Award },
    ],
  },
  {
    section: "SYSTEM",
    items: [
      {
        name: "Notifications",
        href: "/admin/notifications",
        icon: Bell,
        badge: "1",
      },
      { name: "Audit Logs", href: "/admin/audit", icon: FileText },
      { name: "Settings", href: "/admin/settings", icon: Settings },
      { name: "Tickets", href: "/admin/tickets", icon: Ticket }, // 🔥 YOUR FEATURE
    ],
  },
];

export default function SuperAdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen bg-[#f8fafc] border-r border-gray-200 flex flex-col">
      {/* HEADER */}
      <div className="px-5 py-6 border-b border-gray-200">
        <p className="text-lg font-semibold text-gray-800">Super Admin</p>
        <p className="text-xs text-gray-500">Control Panel</p>
      </div>

      {/* NAV */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {nav.map((group) => (
          <div key={group.section}>
            <p className="text-[11px] tracking-widest text-gray-400 px-3 mb-2">
              {group.section}
            </p>

            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition ${
                      isActive
                        ? "bg-blue-100 text-blue-600 font-medium"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={18} />
                      {item.name}
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                          item.name === "Notifications"
                            ? "bg-orange-500 text-white"
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

      {/* USER CARD (BOTTOM) */}
      <div className="border-t border-gray-200 p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
          SA
        </div>
        <div>
          <p className="text-sm font-medium text-gray-800">Engineering Admin</p>
          <p className="text-xs text-gray-500">Super Admin</p>
        </div>
      </div>
    </aside>
  );
}
