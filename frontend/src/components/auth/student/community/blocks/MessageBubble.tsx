import { Stack, Box, Inline } from "@/components/shared/primitives";

interface Props {
  message: {
    id: number;
    text: string;
    sender?: string;
    ts?: string;
  };
  isMe?: boolean;
}

// export function MessageBubble({ message, isMe }: Props) {
//   return (
//     <Inline justify={isMe ? "end" : "start"}>
//       <Box
//         style={{
//           background: isMe ? "#0070f3" : "#f1f1f1",
//           color: isMe ? "white" : "black",
//           padding: 10,
//           borderRadius: 12,
//           maxWidth: "60%",
//         }}
//       >
//         {message.text}
//       </Box>
//     </Inline>
//   );
// }

// components/blocks/MessageBubble.tsx
// export function MessageBubble({ message, isMe, showName }: any) {
//   return (
//     <Stack gap={4} align={isMe ? "end" : "start"} className="max-w-[75%]">
//       {/* Sender Name */}
//       {showName && (
//         <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
//           {message.sender_username || message.sender?.username || "Unknown"}
//         </span>
//       )}

//       {/* Bubble */}
//       <div
//         className={`
//         px-4 py-2.5 rounded-2xl text-sm
//         ${
//           isMe
//             ? "bg-blue-600 text-white rounded-tr-none shadow-sm"
//             : "bg-white text-gray-800 border border-gray-100 rounded-tl-none shadow-sm"
//         }
//       `}
//       >
//         {message.text || message.message}
//       </div>

//       {/* Timestamp */}
//       <span className="text-[9px] text-gray-400 font-medium">
//         {new Date().toLocaleTimeString([], {
//           hour: "2-digit",
//           minute: "2-digit",
//         })}
//       </span>
//     </Stack>
//   );
// }

// components/blocks/MessageBubble.tsx
export function MessageBubble({
  message,
  isMe,
}: {
  message: any;
  isMe: boolean;
}) {
  // Fix for "Unknown": Look for every possible field name the server might use
  const senderName =
    message.sender_username || message.username || message.sender?.username;

  return (
    <div className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}>
      <Stack gap={4} className="max-w-[80%]">
        {/* Name: Only show for other people (Incoming) */}
        {!isMe && (
          <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-2">
            {senderName || "Member"}
          </span>
        )}

        {/* The Bubble */}
        <div
          className={`
          px-4 py-2.5 rounded-[20px] text-[15px] leading-snug shadow-sm
          ${
            isMe
              ? "bg-neutral-900 text-white rounded-tr-none"
              : "bg-white text-neutral-800 border border-neutral-200 rounded-tl-none"
          }
        `}
        >
          {message.message || message.text}
        </div>

        {/* Timestamp: Small and subtle */}
        <div className={`flex ${isMe ? "justify-end" : "justify-start"} px-1`}>
          <span className="text-[9px] font-medium text-neutral-400">
            {new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </Stack>
    </div>
  );
}
