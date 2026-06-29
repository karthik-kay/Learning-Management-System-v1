// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { Stack } from "@/components/primitives";
// import { djangoService } from "@/services/djangoService";
// import { ContactItem } from "../blocks";

// export function StudentContactList() {
//   const [contacts, setContacts] = useState<any[]>([]);
//   const router = useRouter();

//   useEffect(() => {
//     djangoService.getContacts().then(setContacts);
//   }, []);

//   function openDM(userId: number) {
//     router.push(`/student/community/chat?dm=${userId}`);
//   }

//   return (
//     <Stack gap={8} style={{ padding: 16 }}>
//       {contacts.map((u) => (
//         <ContactItem key={u.id} user={u} onClick={() => openDM(u.id)} />
//       ))}
//     </Stack>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Stack, Box, Inline } from "@/components/shared/primitives";
import { ContactItem } from "../blocks/ContactItem";
import { djangoService } from "@/services/djangoService";

export function StudentContactList() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const router = useRouter();
  const params = useSearchParams();

  const activeDm = params.get("dm");
  const activeGroup = params.get("group");

  useEffect(() => {
    djangoService.getContacts().then(setContacts);
    djangoService.getGroups().then(setGroups);
  }, []);

  return (
    <Stack gap={0} className="h-full overflow-hidden">
      <Box className="p-6 border-b border-neutral-50">
        <h2 className="text-2xl font-black tracking-tighter">Messages</h2>
      </Box>

      <Box grow scroll="y" className="p-2 custom-scrollbar">
        {/* GROUPS SECTION */}
        <div className="px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
          Communities
        </div>
        <Stack gap={1} className="mb-4">
          {groups.map((g) => (
            <Box
              key={g.id}
              onClick={() =>
                router.push(`/student/community/chat?group=${g.id}`)
              }
              className={`p-3 rounded-xl cursor-pointer transition-all ${activeGroup === String(g.id) ? "bg-neutral-100 shadow-sm" : "hover:bg-neutral-50"}`}
            >
              <Inline gap={12} align="center">
                <div className="w-10 h-10 bg-black text-white rounded-lg flex items-center justify-center font-bold text-xs">
                  #
                </div>
                <span className="font-bold text-[15px]">{g.name}</span>
              </Inline>
            </Box>
          ))}
        </Stack>

        {/* DMS SECTION */}
        <div className="px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
          Direct Messages
        </div>
        <Stack gap={1}>
          {contacts.map((u) => (
            <div
              key={u.id}
              onClick={() => router.push(`/student/community/chat?dm=${u.id}`)}
              className={`rounded-xl transition-all ${activeDm === String(u.id) ? "bg-neutral-100 shadow-sm" : "hover:bg-neutral-50"}`}
            >
              <ContactItem user={u} />
            </div>
          ))}
        </Stack>
      </Box>
    </Stack>
  );
}
