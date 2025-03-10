import mongoose, { Document, Schema } from "mongoose";

export interface IMessage extends Document {
  chatId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  text: string;
  timestamp: Date;
}

const messageSchema = new Schema({
  chatId: { type: Schema.Types.ObjectId, ref: "Chat", required: true },
  senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model<IMessage>("Message", messageSchema);
