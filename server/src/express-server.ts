import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";

import connectDB from "../config/db";

import userRoutes from "./routes/user";
import chatRoutes from "./routes/chat";
import messageRoutes from "./routes/message";
import webhookRoutes from "./routes/webhook"; // Import the webhook route

import { clerkMiddleware, requireAuth } from "@clerk/express";
dotenv.config();

const app = express();
const PORT = process.env.SERVER_PORT || 5000;

// Middleware
app.use(cors());
// app.use(express.json());
app.use((req, res, next) => {
  if (req.originalUrl.startsWith("/api/webhooks/")) {
    next(); // Skip express.json() for the webhook route
  } else {
    express.json()(req, res, next); // Apply express.json() to other routes
  }
});
app.use(morgan("combined"));
app.use(clerkMiddleware());

// Database connection
connectDB();

// Routes
app.use("/api/users", userRoutes); // User routes
app.use("/api/chats", chatRoutes); // Chat routes
app.use("/api/messages", messageRoutes); // Message routes

app.get("/", requireAuth(), (req: Request, res: Response) => {
  res.send("hellpo yes it works");
});
app.use("/api/webhooks", webhookRoutes); // Add the webhook route

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
