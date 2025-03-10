import express from "express";

import { sendMessage, getMessages } from "../controllers/message.controller";
import { requireAuth } from "@clerk/express";
import catchAsync from "../middlewares/catchAsync";

const router = express.Router();

// Protected routes (require authentication)
router.post("/", requireAuth(), catchAsync(sendMessage)); // Send a message
router.get("/:id", requireAuth(), getMessages); // Get messages for a chat

export default router;
