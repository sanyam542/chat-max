import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  clerkUserId: string;
  username: string;
  email: string;
  createdAt: Date;
  imageUrl: { type: String };
}

const userSchema = new Schema({
  clerkUserId: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  // password: { type: String, required: true },
  imageUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IUser>("User", userSchema);
