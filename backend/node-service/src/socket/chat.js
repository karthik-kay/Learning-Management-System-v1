console.log("🔥 CHAT SOCKET FILE LOADED");

import fetch from "node-fetch";

export function registerChatSockets(io, socket) {
  console.log("chat socket ready:", socket.id);

  // ===============================
  // JOIN ROOM
  // ===============================
  socket.on("join_room", async ({ roomId, token }) => {
    console.log("JOIN REQUEST:", roomId);

    if (!roomId) {
      console.log("JOIN FAILED: no roomId");
      return;
    }

    if (!token) {
      console.log("JOIN FAILED: no token");
      socket.emit("chat_error", "NO_TOKEN");
      return;
    }

    const DJANGO_API = process.env.DJANGO_API;

    if (!DJANGO_API) {
      console.log("DJANGO_API is undefined ❌");
      socket.emit("chat_error", "SERVER_CONFIG_ERROR");
      return;
    }

    try {
      console.log("Using DJANGO_API:", DJANGO_API);

      const res = await fetch(
        `${DJANGO_API}/community/chat/authorize/?room_id=${roomId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!res.ok) {
        console.log("AUTH REQUEST FAILED:", res.status);
        socket.emit("chat_error", "AUTH_FAILED");
        return;
      }

      const data = await res.json();
      console.log("AUTH RESPONSE:", data);

      if (!data.allowed) {
        console.log("NOT AUTHORIZED");
        socket.emit("chat_error", "NOT_AUTHORIZED");
        return;
      }

      socket.join(roomId);
      console.log(`SOCKET ${socket.id} JOINED ROOM ${roomId}`);
    } catch (err) {
      console.error("AUTH ERROR:", err.message);
      socket.emit("chat_error", "AUTH_EXCEPTION");
    }
  });

  // ===============================
  // SEND MESSAGE
  // ===============================
  socket.on("send_message", async ({ roomId, message, sender_id, token }) => {
    console.log("SEND MESSAGE:", roomId, message);

    const saveUrl = `${process.env.DJANGO_API}/community/chat/save/`;

    try {
      const res = await fetch(saveUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ room_id: roomId, message: message }),
      });

      if (res.ok) {
        // We create the 'payload' here so the frontend knows how to draw the bubble
        const broadcastPayload = {
          id: Date.now(),
          text: message,
          sender_id: sender_id,
          ts: new Date().toISOString(),
        };

        console.log("✅ Saved to DB, now broadcasting to room:", roomId);

        // This sends it to everyone in the room live
        io.to(roomId).emit("receive_message", broadcastPayload);
      } else {
        console.log("❌ Django rejected save, status:", res.status);
      }
    } catch (err) {
      console.log("🔥 NODE FETCH ERROR:", err.message);
    }
  });

  // ===============================
  // DISCONNECT
  // ===============================
  socket.on("disconnect", () => {
    console.log("chat socket disconnected:", socket.id);
  });
}
