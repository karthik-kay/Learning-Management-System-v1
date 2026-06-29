import jwt from "jsonwebtoken";
import fetch from "node-fetch";

export function registerLiveClassSockets(io, socket) {
  socket.on("live:join", async ({ token, liveClassId }) => {
    try {
      const user = jwt.verify(token, process.env.DJANGO_SECRET);

      const res = await fetch(
        `${process.env.DJANGO_API}/api/live-classes/${liveClassId}/join/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!res.ok) {
        socket.emit("live:error", "Not allowed");
        return;
      }

      const data = await res.json();

      socket.join(`live-${liveClassId}`);

      socket.emit("live:joined", data);
      socket.to(`live-${liveClassId}`).emit("live:user-joined", {
        userId: user.user_id,
      });
    } catch (err) {
      console.error(err);
      socket.emit("live:error", "Invalid token");
    }
  });
}
