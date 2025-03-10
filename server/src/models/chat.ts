import mongoose, { Document, Schema } from "mongoose";

export interface IChat extends Document {
  name: string;
  participants: mongoose.Types.ObjectId[]; // Array of user IDs
  createdAt: Date;
}

const chatSchema = new Schema({
  name: { type: String, required: true },
  participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IChat>("Chat", chatSchema);
