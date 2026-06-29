import { io, Socket } from "socket.io-client";
import Cookies from "js-cookie";

let socket: Socket | null = null;

export function getSocket(): Socket {
  const endpoint = process.env.NEXT_PUBLIC_NODE_API || "http://localhost:5000";

  if (!socket) {
    socket = io(endpoint, {
      transports: ["websocket"],
      autoConnect: true,
    });

    socket.on("connect", () => {
      console.log("✅ SOCKET CONNECTED:", socket?.id);
    });

    socket.on("connect_error", (err) => {
      console.error("❌ SOCKET CONNECTION ERROR:", err.message);
    });
  }
  return socket;
}

export function getAuthToken() {
  // CRITICAL: Double check your browser cookies (F12 > Application > Cookies)
  // If your cookie is named 'access', change this to 'access'
  return Cookies.get("access_token") || Cookies.get("access");
}
