import { Schema, models, model } from "mongoose";
import { uuid, sharedOptions } from "./_shared";

export const ORDER_STATUSES = ["created", "paid", "failed", "cancelled"] as const;

const orderSchema = new Schema(
  {
    _id: { type: String, default: uuid },
    order_id: { type: String, required: true, unique: true },
    user_id: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    order_status: { type: String, enum: ORDER_STATUSES, required: true },
    shippingDetails: {
      fullName: { type: String, default: "" },
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
      street: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      pinCode: { type: String, default: "" },
    },
    paymentMethod: { type: String, default: "razorpay" },
    couponCode: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: null },
  },
  { ...sharedOptions, _id: false },
);

// Force clear cached model in development to apply schema updates
if (models.Order) {
  delete (models as any).Order;
}

export default model("Order", orderSchema, "orders");
