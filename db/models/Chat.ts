import { Schema, models, model } from "mongoose";
import { sharedOptions } from "./_shared";
import { ROLES } from "./User";

const chatSchema = new Schema(
  {
    // Historically set explicitly by callers (e.g. the outgoing email's id)
    // rather than auto-generated, so no default here.
    _id: { type: String },
    ticketId: { type: String, default: null },
    userEmail: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    role: { type: String, enum: ROLES, default: "support" },
  },
  { ...sharedOptions, _id: false },
);

export default models.Chat || model("Chat", chatSchema, "chats");
