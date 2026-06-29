// import { Box, Stack, Inline, Spacer } from "@/components/primitives";

// interface Props {
//   post: any;
//   onLike?: () => void;
// }

// export function FeedItem({ post, onLike }: Props) {
//   return (
//     <Box
//       style={{
//         border: "1px solid #eee",
//         borderRadius: 12,
//         padding: 16,
//       }}
//     >
//       <Stack gap={8}>
//         <Inline justify="between">
//           <strong>{post.author_username}</strong>
//           <span style={{ fontSize: 12 }}>
//             {new Date(post.created_at).toLocaleString()}
//           </span>
//         </Inline>

//         {post.group_name && (
//           <span style={{ fontSize: 12, color: "#777" }}>{post.group_name}</span>
//         )}

//         <div>{post.content}</div>

//         {post.image && (
//           <img
//             src={post.image}
//             alt="post"
//             style={{ maxWidth: "100%", borderRadius: 8 }}
//           />
//         )}

//         <Spacer size={8} />

//         <Inline gap={12}>
//           <button onClick={onLike}>❤️ {post.likes_count}</button>
//         </Inline>
//       </Stack>
//     </Box>
//   );
// }

"use client";

import { Box, Stack, Inline, Spacer } from "@/components/shared/primitives";

interface Post {
  id: number;
  author_username: string;
  created_at: string;
  content: string;
  image?: string;
  likes_count: number;
  liked_by_me: boolean;
  group_name?: string;
}

interface Props {
  post: Post;
  onLike?: () => void;
}

export function FeedItem({ post, onLike }: Props) {
  // Format date professionally (e.g., "Oct 24, 2023")
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(post.created_at));

  return (
    <Box className="bg-white border border-gray-200/80 rounded-xl p-5 transition-all duration-200 hover:border-gray-300 hover:shadow-sm">
      <Stack gap={12}>
        {/* Header: Author & Date */}
        <Inline justify="between" align="center">
          <Stack gap={0}>
            <span className="font-semibold text-gray-900 text-[15px] tracking-tight">
              @{post.author_username}
            </span>
            {post.group_name && (
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600/80">
                {post.group_name}
              </span>
            )}
          </Stack>
          <span className="text-xs text-gray-400 font-medium">
            {formattedDate}
          </span>
        </Inline>

        {/* Content */}
        <div className="text-[15px] leading-relaxed text-gray-800 whitespace-pre-wrap">
          {post.content}
        </div>

        {/* Image Attachment */}
        {post.image && (
          <div className="relative mt-2 overflow-hidden rounded-lg border border-gray-100">
            <img
              src={post.image}
              alt="Post attachment"
              className="w-full h-auto object-cover max-h-[450px] transition-transform duration-500 hover:scale-[1.02]"
            />
          </div>
        )}

        <Spacer size={4} />

        {/* Action Bar */}
        <Inline gap={12} align="center">
          <button
            onClick={onLike}
            className={`
              flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-200
              ${
                post.liked_by_me
                  ? "bg-red-50 text-red-600 ring-1 ring-red-100"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }
            `}
          >
            <span className={post.liked_by_me ? "scale-110" : ""}>
              {post.liked_by_me ? "❤️" : "🤍"}
            </span>
            <span className="text-sm font-semibold">{post.likes_count}</span>
          </button>
        </Inline>
      </Stack>
    </Box>
  );
}
