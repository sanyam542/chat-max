import express from "express";

import {
  getUserById,
  searchUsers,
  updateUser,
  deleteUser,
} from "../controllers/user.contoller";
import { requireAuth } from "@clerk/express";
import catchAsync from "../middlewares/catchAsync";

const router: express.Router = express.Router();

// Public routes

// Protected routes (require authentication)
router.get("/search", requireAuth(), catchAsync(searchUsers)); // Search for users
router.get("/:id", requireAuth(), catchAsync(getUserById)); // Get user by ID
router.put("/:id", requireAuth(), catchAsync(updateUser)); // Update a user
router.delete("/:id", requireAuth(), catchAsync(deleteUser)); // Delete a user

export default router;
