import { Schema, models, model } from "mongoose";
import { uuid, sharedOptions } from "./_shared";

export const TICKET_STATUSES = ["pending", "open", "completed", "replied"] as const;

const ticketSchema = new Schema(
  {
    _id: { type: String, default: uuid },
    userId: { type: String, default: null },
    subject: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    status: { type: String, enum: TICKET_STATUSES, default: "pending" },
  },
  { ...sharedOptions, _id: false },
);

export default models.Ticket || model("Ticket", ticketSchema, "ticket");
