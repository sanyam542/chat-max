import { Request, Response } from "express";
import User from "../models/user";

// Get user by ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

// Search for users by username or email
export const searchUsers = async (req: Request, res: Response) => {
  try {
    const query = req.query.q as string;

    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    });
    console.log(users);
    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

// Update a user
export const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const { username, email, password } = req.body;

    // Find the user and update their details
    const user = await User.findByIdAndUpdate(
      userId,
      { username, email, password },
      { new: true } // Return the updated user
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

// Delete a user
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    // Find the user and delete them
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};
