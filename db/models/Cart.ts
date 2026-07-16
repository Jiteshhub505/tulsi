import { Schema, models, model } from "mongoose";
import { uuid, sharedOptions } from "./_shared";

export const CART_STATUSES = ["active", "completed", "abandoned"] as const;

const cartSchema = new Schema(
  {
    _id: { type: String, default: uuid },
    userId: { type: String, default: null },
    status: { type: String, enum: CART_STATUSES, default: "active" },
  },
  { ...sharedOptions, _id: false },
);

export default models.Cart || model("Cart", cartSchema, "cart");
