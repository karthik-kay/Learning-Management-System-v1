// import { Box } from "@/components/primitives";

// interface Props {
//   user: {
//     id: number;
//     username: string;
//   };
//   onClick?: () => void;
// }

// export function ContactItem({ user, onClick }: Props) {
//   return (
//     <Box
//       onClick={onClick}
//       style={{
//         padding: 10,
//         cursor: "pointer",
//         borderRadius: 8,
//       }}
//     >
//       {user.username}
//     </Box>
//   );
// }

"use client";

import { Box, Inline, Stack } from "@/components/shared/primitives";

interface Props {
  user: {
    id: number;
    username: string;
    avatar?: string; // Add optional avatar
    status?: string; // e.g., "Active now"
  };
  onClick?: () => void;
}

export function ContactItem({ user, onClick }: Props) {
  // Generate a consistent color based on the username for the avatar fallback
  const charCodeSum = user.username
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const colors = [
    "bg-blue-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-orange-500",
    "bg-indigo-500",
  ];
  const avatarColor = colors[charCodeSum % colors.length];

  return (
    <Box
      onClick={onClick}
      className="group w-full px-4 py-3 cursor-pointer transition-all duration-200 hover:bg-neutral-50 active:bg-neutral-100"
    >
      <Inline gap={16} align="center">
        {/* AVATAR WRAPPER */}
        <div className="relative">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-sm overflow-hidden ${avatarColor}`}
          >
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-sm tracking-tighter uppercase">
                {user.username.slice(0, 2)}
              </span>
            )}
          </div>

          {/* ONLINE INDICATOR */}
          <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full shadow-sm" />
        </div>

        {/* TEXT CONTENT */}
        <Stack gap={0} className="grow">
          <Inline justify="between" align="center">
            <span className="text-[15px] font-bold text-neutral-900 group-hover:text-black transition-colors">
              {user.username}
            </span>
            <span className="text-[10px] font-medium text-neutral-400 uppercase tracking-widest">
              Just now
            </span>
          </Inline>

          <p className="text-xs text-neutral-500 truncate max-w-[200px] font-medium">
            Tap to start a chat...
          </p>
        </Stack>

        {/* HOVER ARROW (Optional but looks pro) */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-neutral-300"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </div>
      </Inline>
    </Box>
  );
}
