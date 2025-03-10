import express from "express";
import { Webhook } from "svix";
import User from "../models/user";
import dotenv from "dotenv";
import { clerkClient } from "@clerk/express";
import catchAsync from "../middlewares/catchAsync";
const router = express.Router();

dotenv.config();

// Initialize the Svix webhook
const clerkWebhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);
// Webhook endpoint
catchAsync;
router.post(
  "/clerk",
  express.raw({ type: "application/json" }),
  catchAsync(async (req, res) => {
    try {
      // Get the webhook payload and headers
      const payload = req.body;
      const headers = {
        "svix-id": req.headers["svix-id"] as string,
        "svix-timestamp": req.headers["svix-timestamp"] as string,
        "svix-signature": req.headers["svix-signature"] as string,
      };
      // Verify the webhook signature
      const event = clerkWebhook.verify(payload, headers) as any;

      // Handle the "user.created" event

      if (event.type === "user.created") {
        const { id, username, email_addresses, image_url } = event.data;

        // Extract the primary email
        const primaryEmail = email_addresses.find(
          (email: any) => email.id === event.data.primary_email_address_id
        )?.email_address;

        // Create a new user in your database
        const user = new User({
          clerkUserId: id,
          username: username || primaryEmail?.split("@")[0], // Use email prefix if username is not provided
          imageUrl: image_url,
          email: primaryEmail,
        });

        await user.save();

        await clerkClient.users.updateUser(id, {
          publicMetadata: {
            userId: user._id,
          },
        });
      }

      if (event.type === "session.created") {
        const { user_id } = event.data;
        // Find user in your database
        const user = await User.findOne({ clerkUserId: user_id });

        if (!user) {
          return res.status(500).json({ error: "User Not Found" });
        }

        await clerkClient.users.updateUser(user_id, {
          publicMetadata: {
            userId: user._id,
          },
        });
      }

      res.status(200).json({ success: true });
    } catch (err) {
      console.error("Webhook error:", err);
      res.status(400).json({ error: "Webhook verification failed" });
    }
  })
);

export default router;
