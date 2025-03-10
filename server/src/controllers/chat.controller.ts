import { Request, Response } from "express";
import Chat from "../models/chat";
import { getAuth } from "@clerk/express";
import { Types } from "mongoose"; // Import Types from mongoose
import { log } from "console";
import User from "../models/user";

// Create a new chat
export const createChat = async (req: Request, res: Response) => {
  try {
    const { name, participants } = req.body;
    // const userId = req.auth.userId; // Authenticated user's ID from Clerk
    const { userId } = getAuth(req);
    const user = await User.findOne({ clerkUserId: userId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // Ensure the authenticated user is included in the participants
    if (!participants.includes(user._id)) {
      participants.push(user._id);
    }

    const chat = new Chat({ name, participants });
    await chat.save();
    res.status(201).json({ chat });
  } catch (err) {
    console.log(err);

    res.status(500).json({ error: (err as Error).message });
  }
};

// Get a chat by ID
export const getChat = async (req: Request, res: Response) => {
  try {
    const chatId = req.params.id;
    const chat = await Chat.findById(chatId).populate("participants");
    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }
    res.status(200).json({ chat });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

// Get all chats of a User
export const getAllChats = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    const user = await User.findOne({ clerkUserId: userId });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find all chats where the user is a participant
    const chats = await Chat.find({ participants: user._id }).populate(
      "participants"
    );

    res.status(200).json({ chats });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

// Add participants to a chat
export const addParticipants = async (req: Request, res: Response) => {
  try {
    const chatId = req.params.id;
    const { participants } = req.body;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    // Add new participants (avoid duplicates)
    participants.forEach((participantId: string) => {
      const participantObjectId = new Types.ObjectId(participantId); // Convert string to ObjectId
      if (!chat.participants.includes(participantObjectId)) {
        chat.participants.push(participantObjectId);
      }
    });

    await chat.save();
    res.status(200).json({ chat });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};
