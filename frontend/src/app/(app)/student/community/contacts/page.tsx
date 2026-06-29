// "use client";

// import { useEffect, useState } from "react";
// import { djangoService } from "@/services/djangoService";
// import { useRouter } from "next/navigation";

// export default function ContactsPage() {
//   const [contacts, setContacts] = useState<any[]>([]);
//   const router = useRouter();

//   useEffect(() => {
//     djangoService.getContacts().then(setContacts);
//   }, []);

//   function openDM(userId: number) {
//     router.push(`/student/community/chat?dm=${userId}`);
//   }

//   return (
//     <div>
//       <h2>Contacts</h2>
//       {contacts.map((u) => (
//         <div key={u.id} onClick={() => openDM(u.id)}>
//           {u.username}
//         </div>
//       ))}
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { djangoService } from "@/services/djangoService";
import { useRouter } from "next/navigation";
import { Box, Stack, Inline, Spacer } from "@/components/shared/primitives";
import { ContactItem } from "@/components/auth/student/community/blocks/ContactItem"; // Using that pro block we just made

export default function ContactsPage() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    djangoService.getContacts().then(setContacts);
  }, []);

  const filteredContacts = contacts.filter((u) =>
    u.username?.toLowerCase().includes(search.toLowerCase()),
  );

  function openDM(userId: number) {
    router.push(`/student/community/chat?dm=${userId}`);
  }

  return (
    <Box className="min-h-screen bg-[#FAFAFA]">
      <Box className="max-w-2xl mx-auto py-10 px-6">
        {/* Header Section */}
        <Stack gap={20}>
          <Inline justify="between" align="end">
            <Stack gap={2}>
              <h2 className="text-3xl font-black tracking-tight text-neutral-900">
                Community
              </h2>
              <p className="text-sm font-medium text-neutral-500">
                {contacts.length} Students online now
              </p>
            </Stack>

            {/* Action Button: Optional "Find New" */}
            <button className="bg-black text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-neutral-800 transition-all active:scale-95">
              FIND STUDENTS
            </button>
          </Inline>

          {/* Search Bar - Insta Style */}
          <div className="relative">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your contacts..."
              className="w-full bg-white border border-neutral-200 rounded-2xl px-5 py-4 text-sm shadow-sm focus:ring-2 focus:ring-black/5 focus:border-neutral-300 transition-all outline-none"
            />
          </div>

          {/* Contacts List Card */}
          <Box className="bg-white rounded-[32px] border border-neutral-100 shadow-sm overflow-hidden">
            <Stack gap={0} className="divide-y divide-neutral-50">
              {filteredContacts.length > 0 ? (
                filteredContacts.map((u) => (
                  <div
                    key={u.id}
                    className="hover:bg-neutral-50 transition-colors cursor-pointer"
                  >
                    <ContactItem user={u} onClick={() => openDM(u.id)} />
                  </div>
                ))
              ) : (
                <Box className="py-20 flex flex-col items-center justify-center opacity-40">
                  <span className="text-4xl mb-2">🔍</span>
                  <p className="text-sm font-bold tracking-widest uppercase">
                    No one found
                  </p>
                </Box>
              )}
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}
