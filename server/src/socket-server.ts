import http from "http";
import { Server } from "socket.io";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import Message from "./models/message";
import connectDB from "../config/db";

dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(cors({ origin: "*" }));

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: `*`, // Replace with your frontend URL
    methods: ["GET", "POST"],
  },
});

// Database connection
connectDB();

// Socket.IO connection handler
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Join a chat room
  // socket.on("join_room", (roomId) => {
  //   socket.join(roomId);
  //   console.log(`User ${socket.id} joined room ${roomId}`);
  // });

  // Handle chat messages
  socket.on("send_message", async (data) => {
    console.log("Message received:", data);

    const { chatId, senderId, text } = data;
    const message = new Message({ chatId, senderId, text });
    await message.save();

    // Broadcast the message to all connected clients
    io.emit("receive_message", message);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

// Start the Socket.IO server
const PORT = process.env.SOCKET_SERVER_PORT || 5001;
server.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});
