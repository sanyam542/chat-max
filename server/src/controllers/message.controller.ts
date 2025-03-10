import { Request, Response } from "express";
import Message from "../models/message";
import { getAuth } from "@clerk/express";
import User from "../models/user";

// Send a message in a chat
export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { chatId, text } = req.body;

    // if (!chatId) {
    //    const chat = new Chat({ name, participants });
    //       await chat.save();
    // }
    console.log(chatId, text);

    const { userId } = getAuth(req);
    const user = await User.findOne({ clerkUserId: userId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const senderId = user._id;

    // const findSender= await
    const message = new Message({ chatId, senderId, text });
    await message.save();
    res.status(201).json({ message });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

// Get messages for a chat
export const getMessages = async (req: Request, res: Response) => {
  try {
    const chatId = req.params.id;

    const messages = await Message.find({ chatId }).sort({ timestamp: 1 });

    res.status(200).json({ messages });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};
