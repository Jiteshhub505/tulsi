import { Schema, models, model } from "mongoose";
import { uuid, sharedOptions } from "./_shared";

const orderItemSchema = new Schema(
  {
    _id: { type: String, default: uuid },
    order_id: { type: String, required: true },
    product_id: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
  },
  { ...sharedOptions, _id: false },
);

export default models.OrderItem || model("OrderItem", orderItemSchema, "order_items");
