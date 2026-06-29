// "use client";

// import { useEffect, useState } from "react";
// import { useRouter, usePathname, useSearchParams } from "next/navigation";
// import { Stack, Divider } from "@/components/primitives";
// import { djangoService } from "@/services/djangoService";
// import { GroupListItem } from "../blocks";

// export function StudentCommunitySidebar() {
//   const router = useRouter();
//   const pathname = usePathname();
//   const params = useSearchParams();
//   const activeGroup = params.get("group");

//   const [groups, setGroups] = useState<any[]>([]);

//   useEffect(() => {
//     djangoService.getGroups().then(setGroups);
//   }, []);

//   function isActive(path: string) {
//     return pathname.includes(path);
//   }

//   return (
//     <Stack gap={8} style={{ padding: 16 }}>
//       <h3>Community</h3>

//       {/* MAIN NAVIGATION */}
//       <GroupListItem
//         group={{ id: 0, name: "Feed" }}
//         active={isActive("/feed")}
//         onClick={() => router.push("/student/community/feed")}
//       />

//       <GroupListItem
//         group={{ id: -1, name: "Groups" }}
//         active={isActive("/groups")}
//         onClick={() => router.push("/student/community/groups")}
//       />

//       <GroupListItem
//         group={{ id: -2, name: "Contacts" }}
//         active={isActive("/contacts")}
//         onClick={() => router.push("/student/community/contacts")}
//       />

//       <GroupListItem
//         group={{ id: -3, name: "Chat" }}
//         active={isActive("/chat")}
//         onClick={() => router.push("/student/community/chat")}
//       />

//       <GroupListItem
//         group={{ id: -4, name: "Settings" }}
//         active={isActive("/settings")}
//         onClick={() => router.push("/student/community/settings")}
//       />

//       <Divider />

//       {/* GROUP FEEDS */}
//       <h4>Your Groups</h4>

//       {groups.map((g) => (
//         <GroupListItem
//           key={g.id}
//           group={g}
//           active={pathname.includes("/feed") && activeGroup === String(g.id)}
//           onClick={() => router.push(`/student/community/feed?group=${g.id}`)}
//         />
//       ))}
//     </Stack>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Stack, Divider, Box } from "@/components/shared/primitives";
import { djangoService } from "@/services/djangoService";
import { GroupListItem } from "../blocks";

interface Group {
  id: number;
  name: string;
}

export function StudentCommunitySidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const activeGroupParam = params.get("group");

  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    djangoService
      .getGroups()
      .then(setGroups)
      .finally(() => setLoading(false));
  }, []);

  // Configuration for Main Navigation items
  const mainNavItems = [
    { name: "Global Feed", path: "/student/community/feed", slug: "/feed" },
    {
      name: "Explore Groups",
      path: "/student/community/groups",
      slug: "/groups",
    },
    {
      name: "Contacts",
      path: "/student/community/contacts",
      slug: "/contacts",
    },
    { name: "Direct Messages", path: "/student/community/chat", slug: "/chat" },
    {
      name: "Settings",
      path: "/student/community/settings",
      slug: "/settings",
    },
  ];

  return (
    <Box className="w-full h-full bg-white border-r border-gray-100 px-4 py-6 overflow-y-auto">
      <Stack gap={24}>
        {/* Main Navigation Section */}
        <Stack gap={4}>
          <h3 className="px-3 text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
            Community
          </h3>
          {mainNavItems.map((item) => (
            <GroupListItem
              key={item.slug}
              group={{ id: Math.random(), name: item.name }} // Placeholder IDs for the mock objects
              active={pathname.includes(item.slug)}
              onClick={() => router.push(item.path)}
            />
          ))}
        </Stack>

        <Divider className="opacity-60" />

        {/* Dynamic Groups Section */}
        <Stack gap={4}>
          <h4 className="px-3 text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
            Your Groups
          </h4>

          {loading ? (
            <div className="px-3 py-2 animate-pulse space-y-3">
              <div className="h-4 bg-gray-100 rounded w-3/4" />
              <div className="h-4 bg-gray-100 rounded w-1/2" />
            </div>
          ) : (
            groups.map((g) => (
              <GroupListItem
                key={g.id}
                group={g}
                active={
                  pathname.includes("/feed") &&
                  activeGroupParam === String(g.id)
                }
                onClick={() =>
                  router.push(`/student/community/feed?group=${g.id}`)
                }
              />
            ))
          )}

          {!loading && groups.length === 0 && (
            <p className="px-3 text-sm text-gray-400 italic">
              No groups joined yet.
            </p>
          )}
        </Stack>
      </Stack>
    </Box>
  );
}
