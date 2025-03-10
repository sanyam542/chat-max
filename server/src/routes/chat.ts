import express from "express";
import {
  createChat,
  getChat,
  addParticipants,
  getAllChats,
} from "../controllers/chat.controller";
import { requireAuth } from "@clerk/express";
import catchAsync from "../middlewares/catchAsync";

const router = express.Router();

// Protected routes (require authentication)
router.post("/", requireAuth(), catchAsync(createChat)); // Create a new chat
router.get("/", requireAuth(), catchAsync(getAllChats)); // Get a chat by ID
router.get("/:id", requireAuth(), catchAsync(getChat)); // Get a chat by ID
router.post("/:id/participants", requireAuth(), catchAsync(addParticipants)); // Add participants to a chat

export default router;
