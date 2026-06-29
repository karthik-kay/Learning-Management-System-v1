// "use client";

// import { useSearchParams } from "next/navigation";
// import { StudentContactList } from "@/components/auth/student/community/compositions/StudentContactList";
// import { StudentChatView } from "@/components/auth/student/community";
// import { Inline, Box } from "@/components/primitives";

// export default function ChatPage() {
//   const params = useSearchParams();
//   const hasActiveChat = params.get("dm") || params.get("group");

//   return (
//     <Inline grow className="h-[calc(100vh-64px)] overflow-hidden">
//       {/* LEFT SIDE: Always show the contact list (The Inbox) */}
//       <Box className="w-[350px] border-r border-neutral-100 h-full bg-white">
//         <StudentContactList />
//       </Box>

//       {/* RIGHT SIDE: Show the Chat or a Placeholder */}
//       <Box grow className="h-full bg-[#f0f2f5]">
//         {hasActiveChat ? (
//           <StudentChatView />
//         ) : (
//           <div className="flex flex-col items-center justify-center h-full opacity-30">
//             <div className="text-6xl mb-4">💬</div>
//             <p className="font-bold uppercase tracking-[0.2em] text-xs">
//               Select a conversation to start messaging
//             </p>
//           </div>
//         )}
//       </Box>
//     </Inline>
//   );
// }
"use client";

import { useSearchParams } from "next/navigation";
import { StudentContactList } from "@/components/auth/student/community/compositions/StudentContactList";
import { StudentChatView } from "@/components/auth/student/community/compositions/StudentChatView";
import { Inline, Box, Stack } from "@/components/shared/primitives";

export default function ChatPage() {
  const params = useSearchParams();
  const roomId = params.get("dm") || params.get("group");

  return (
    <Inline grow className="h-[calc(100vh-64px)] overflow-hidden bg-white">
      {/* LEFT: The WhatsApp-style Sidebar */}
      <Box className="w-[380px] border-r border-neutral-100 h-full flex flex-col">
        <StudentContactList />
      </Box>

      {/* RIGHT: The Actual Conversation */}
      <Box grow className="h-full bg-[#F0F2F5] relative">
        {roomId ? (
          <StudentChatView key={roomId} /> // key forces re-mount on swap
        ) : (
          <Stack align="center" justify="center" className="h-full opacity-30">
            <div className="text-6xl mb-4">💬</div>
            <p className="font-bold uppercase tracking-[0.2em] text-xs text-neutral-500">
              Select a chat to start messaging
            </p>
          </Stack>
        )}
      </Box>
    </Inline>
  );
}
