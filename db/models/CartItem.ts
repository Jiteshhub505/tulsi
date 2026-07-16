import { Schema, models, model } from "mongoose";
import { uuid, sharedOptions } from "./_shared";

const cartItemSchema = new Schema(
  {
    _id: { type: String, default: uuid },
    cartId: { type: String, required: true },
    productId: { type: String, required: true },
    quantity: { type: Number, default: 1 },
  },
  { ...sharedOptions, _id: false },
);

export default models.CartItem || model("CartItem", cartItemSchema, "cartItems");
