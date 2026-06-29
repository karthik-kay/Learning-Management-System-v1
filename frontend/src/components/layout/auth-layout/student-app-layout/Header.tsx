"use client";

import { Search, Bell, Sun } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";

import Link from "next/link";
import { UserProfile } from "@/types";
import Image from "next/image";

const LOGO = "/logo-1.png";

export default function Header({ user }: { user: UserProfile | null }) {
  const breadcrumbs = useBreadcrumb("Main");

  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-gray-100 w-full ">
      <div className="px-8 py-3">
        <div className="flex items-center justify-between">
          {/* LEFT: Title + Welcome */}
          <div className="flex flex-col">
            <Image src={LOGO} alt="logo" width={120} height={40} priority />
          </div>

          {/* RIGHT: Search + Icons */}
          <div className="flex items-center gap-6">
            {/* SEARCH BAR */}
            <div
              className="hidden md:flex items-center rounded-xl px-4 py-2 
                   bg-[#F4F7FE] border border-[#E2E8F0]"
            >
              <Search size={18} className="text-[#A3AED0] mr-3" />

              <input
                type="text"
                placeholder="Search courses, topics..."
                className="outline-none text-sm bg-transparent w-64 placeholder-gray-500"
              />
            </div>

            {/* ICONS GROUP */}
            <div className="flex items-center gap-1">
              {/* THEME ICON */}
              <button className="p-2 rounded-xl transition-colors">
                <Sun className="w-5 h-5 text-[#A3AED0] hover:text-secondary-dark transition-colors" />
              </button>

              {/* NOTIFICATIONS ICON */}
              <button className="p-2 rounded-xl relative transition-colors">
                <Bell className="w-5 h-5 text-[#A3AED0] hover:text-secondary-dark transition-colors" />
                <div className="absolute -top-[-1] -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
              </button>

              {/* AVATAR */}
            </div>
            <Avatar className="w-8 h-8">
              <AvatarImage src={user?.profile_image} alt={user?.username} />
              <AvatarFallback className="bg-blue-600 text-white text-sm">
                {user?.username?.charAt(0)?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
}
