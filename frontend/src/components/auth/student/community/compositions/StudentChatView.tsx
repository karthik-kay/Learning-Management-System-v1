"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Stack, Box, Inline } from "@/components/shared/primitives";
import { MessageBubble } from "../blocks";
import { getSocket, getAuthToken } from "@/services/socket";
import { djangoService } from "@/services/djangoService"; // Import your service

export function StudentChatView() {
  const params = useSearchParams();
  const group = params.get("group");
  const dm = params.get("dm");

  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // --- 1. GET YOUR ID FROM THE TOKEN ---
  const token = getAuthToken();
  let myId: number | null = null;

  if (token) {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const payload = JSON.parse(window.atob(base64));
      myId = payload.user_id || payload.id;
    } catch (e) {
      console.error("Token decode failed bruv", e);
    }
  }

  // --- 2. GENERATE DETERMINISTIC ROOM ID ---
  let roomId = "";
  if (group) {
    roomId = `group:${group}`;
  } else if (dm && myId) {
    const ids = [Number(myId), Number(dm)].sort((a, b) => a - b);
    roomId = `dm:${ids[0]}_${ids[1]}`;
  }

  // --- 3. SYNC HISTORY & SOCKET ---
  useEffect(() => {
    if (!roomId || roomId.includes("null") || roomId.includes("undefined")) {
      return;
    }

    const socket = getSocket();
    const currentToken = getAuthToken();

    // Load old messages from Django DB
    const syncChat = async () => {
      try {
        console.log("📜 Fetching history for:", roomId);
        const history = await djangoService.getChatHistory(roomId);
        setMessages(history);
      } catch (err) {
        console.error("Failed to load history bruv:", err);
      }

      // Join room for real-time updates
      console.log("🚀 Joining live socket:", roomId);
      socket.emit("join_room", { roomId, token: currentToken });
    };

    syncChat();

    const handleMessage = (msg: any) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("receive_message", handleMessage);

    return () => {
      socket.off("receive_message", handleMessage);
      console.log("🧹 Left room:", roomId);
    };
  }, [roomId]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  function sendMessage() {
    if (!text.trim() || !roomId || !myId) return;

    // Send to Node (Node will then broadcast AND call Django save)
    getSocket().emit("send_message", {
      roomId,
      message: text,
      sender_id: myId,
      token: getAuthToken(), // Pass token so Node can save to Django
    });

    setText("");
  }

  return (
    <Stack grow className="h-full overflow-hidden bg-white">
      {/* Header */}
      <Box className="p-4 border-b border-neutral-200 bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <Inline align="center" gap={12}>
          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs uppercase">
            {group ? "GRP" : "DM"}
          </div>
          <Stack gap={0}>
            <span className="font-bold text-sm tracking-tight">
              {group ? `Group ${group}` : `Chatting with User ${dm}`}
            </span>
            <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-semibold">
              {isMounted ? roomId : ""}
            </span>
          </Stack>
        </Inline>
      </Box>

      {/* Messages List */}
      <Box
        grow
        scroll="y"
        ref={scrollRef}
        className="p-6 space-y-4 bg-neutral-50/50"
      >
        {messages.length === 0 && (
          <div className="text-center py-10 text-neutral-400 text-sm italic">
            No messages yet. Start the convo bruv!
          </div>
        )}
        {messages.map((m, i) => (
          <MessageBubble
            key={m.id || i}
            message={m}
            isMe={String(m.sender_id) === String(myId)}
          />
        ))}
      </Box>

      {/* Input Field */}
      <Box className="p-4 bg-white border-t border-neutral-200">
        <Inline
          gap={12}
          align="center"
          className="bg-neutral-100 rounded-2xl px-4 py-1"
        >
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type your message..."
            className="grow bg-transparent border-none outline-none text-[15px] py-3"
          />
          <button
            onClick={sendMessage}
            disabled={!text.trim()}
            className="text-blue-600 font-bold text-sm px-2 disabled:opacity-30 transition-opacity"
          >
            SEND
          </button>
        </Inline>
      </Box>
    </Stack>
  );
}
