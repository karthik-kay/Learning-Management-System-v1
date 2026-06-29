import dotenv from "dotenv";
dotenv.config();

import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";

import { registerLiveClassSockets } from "./src/socket/liveClasses.js";
import { registerChatSockets } from "./src/socket/chat.js";

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("socket connected:", socket.id);

  registerLiveClassSockets(io, socket);
  registerChatSockets(io, socket);

  socket.on("disconnect", () => {
    console.log("socket disconnected:", socket.id);
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "node-realtime" });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Node service running on port ${PORT}`);
});
