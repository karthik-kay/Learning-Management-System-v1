// "use client";

// import { useEffect, useState } from "react";
// import { useSearchParams } from "next/navigation";
// import { Box, Stack } from "@/components/primitives";
// import { djangoService } from "@/services/djangoService";
// import { FeedItem, CreatePostForm } from "../blocks";

// export function StudentCommunityFeed() {
//   const params = useSearchParams();
//   const groupParam = params.get("group");
//   const activeGroupId = groupParam ? Number(groupParam) : null;

//   const [posts, setPosts] = useState<any[]>([]);
//   const [page, setPage] = useState(1);
//   const [hasNext, setHasNext] = useState(true);
//   const [loading, setLoading] = useState(false);

//   // reset on group change
//   useEffect(() => {
//     setPosts([]);
//     setPage(1);
//     setHasNext(true);
//   }, [activeGroupId]);

//   useEffect(() => {
//     let cancelled = false;

//     async function load() {
//       setLoading(true);

//       const data = await djangoService.getCommunityFeed(page, activeGroupId);

//       if (cancelled) return;

//       setPosts((prev) =>
//         page === 1 ? data.results : [...prev, ...data.results],
//       );

//       setHasNext(data.has_next);
//       setLoading(false);
//     }

//     load();

//     return () => {
//       cancelled = true;
//     };
//   }, [page, activeGroupId]);

//   async function handleCreatePost(data: { content: string; image?: File }) {
//     await djangoService.createCommunityPost({
//       ...data,
//       group: activeGroupId,
//     });

//     setPosts([]);
//     setPage(1);
//   }

//   async function handleLike(postId: number) {
//     await djangoService.togglePostLike(postId);

//     setPosts((prev) =>
//       prev.map((p) =>
//         p.id === postId
//           ? {
//               ...p,
//               likes_count: p.liked_by_me
//                 ? p.likes_count - 1
//                 : p.likes_count + 1,
//               liked_by_me: !p.liked_by_me,
//             }
//           : p,
//       ),
//     );
//   }

//   function handleScroll(e: React.UIEvent<HTMLDivElement>) {
//     if (loading || !hasNext) return;

//     const el = e.currentTarget;
//     const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 200;

//     if (nearBottom) {
//       setPage((p) => p + 1);
//     }
//   }

//   return (
//     <Box grow scroll="y" onScroll={handleScroll} style={{ padding: 16 }}>
//       <Stack gap={16}>
//         <CreatePostForm onSubmit={handleCreatePost} />

//         {posts.map((post) => (
//           <FeedItem
//             key={post.id}
//             post={post}
//             onLike={() => handleLike(post.id)}
//           />
//         ))}

//         {loading && <div>Loading…</div>}
//       </Stack>
//     </Box>
//   );
// }

"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Box, Stack, Spacer, Divider } from "@/components/shared/primitives";
import { djangoService } from "@/services/djangoService";
import { FeedItem, CreatePostForm } from "../blocks";

interface Post {
  id: number;
  content: string;
  likes_count: number;
  liked_by_me: boolean;
  [key: string]: any;
}

export function StudentCommunityFeed() {
  const params = useSearchParams();
  const activeGroupId = useMemo(() => {
    const group = params.get("group");
    return group ? Number(group) : null;
  }, [params]);

  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setPosts([]);
    setPage(1);
    setHasNext(true);
  }, [activeGroupId]);

  useEffect(() => {
    let isMounted = true;
    async function loadFeed() {
      setIsLoading(true);
      try {
        const data = await djangoService.getCommunityFeed(page, activeGroupId);
        if (!isMounted) return;
        setPosts((prev) =>
          page === 1 ? data.results : [...prev, ...data.results],
        );
        setHasNext(data.has_next);
      } catch (error) {
        console.error("Feed error:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadFeed();
    return () => {
      isMounted = false;
    };
  }, [page, activeGroupId]);

  const handleLike = async (postId: number) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              likes_count: p.liked_by_me
                ? p.likes_count - 1
                : p.likes_count + 1,
              liked_by_me: !p.liked_by_me,
            }
          : p,
      ),
    );
    try {
      await djangoService.togglePostLike(postId);
    } catch (e) {
      console.error("Like failed", e);
    }
  };

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      if (isLoading || !hasNext) return;
      const { scrollHeight, scrollTop, clientHeight } = e.currentTarget;
      if (scrollHeight - scrollTop - clientHeight < 300) {
        setPage((prev) => prev + 1);
      }
    },
    [isLoading, hasNext],
  );

  return (
    <Box
      grow
      scroll="y"
      onScroll={handleScroll}
      className="bg-gray-50/50 min-h-screen antialiased"
    >
      <Stack gap={24} className="max-w-2xl mx-auto px-4 py-8">
        {/* Post Creator Section */}
        <Box className="bg-white rounded-xl shadow-sm border border-gray-200/60 p-5 transition-shadow hover:shadow-md">
          <CreatePostForm
            onSubmit={async (data) => {
              await djangoService.createCommunityPost({
                ...data,
                group: activeGroupId,
              });
              setPosts([]);
              setPage(1);
            }}
          />
        </Box>

        <Divider className="opacity-50" />

        {/* Feed List */}
        <Stack gap={4} className="w-full">
          {posts.map((post) => (
            <div key={post.id} className="transition-all duration-200">
              <FeedItem post={post} onLike={() => handleLike(post.id)} />
              <Spacer size={12} />
            </div>
          ))}
        </Stack>

        {/* Loading Indicator */}
        {isLoading && (
          <Box className="flex flex-col items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-3" />
            <span className="text-sm font-medium text-gray-500 tracking-tight">
              Loading more updates...
            </span>
          </Box>
        )}

        {/* End of Feed Spacer */}
        {!hasNext && posts.length > 0 && (
          <Box className="text-center py-10">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              You're all caught up
            </span>
          </Box>
        )}

        <Spacer size={64} />
      </Stack>
    </Box>
  );
}
