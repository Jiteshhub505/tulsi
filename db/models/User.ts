import mongoose, { Schema, models, model } from "mongoose";

export const ROLES = ["user", "support", "admin"] as const;
export type Role = (typeof ROLES)[number];

/**
 * Bound to the same "users" collection that @auth/mongodb-adapter writes to
 * (adapter assigns a Mongo ObjectId as _id on first sign-in). Extra fields
 * below (phone, role) are simply absent on adapter-created docs until we
 * update them, so always fall back to sensible defaults when reading.
 */
const userSchema = new Schema(
  {
    name: { type: String, default: null },
    email: { type: String, unique: true, sparse: true },
    emailVerified: { type: Date, default: null },
    image: { type: String, default: null },
    phone: { type: String, default: "" },
    role: { type: String, enum: ROLES, default: "user" },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "users", toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

export default models.User || model("User", userSchema);
