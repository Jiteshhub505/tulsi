import { Schema, models, model } from "mongoose";
import { uuid, sharedOptions } from "./_shared";

const couponSchema = new Schema(
  {
    _id: { type: String, default: uuid },
    code: { type: String, required: true, uppercase: true, trim: true, unique: true },
    discountType: { type: String, enum: ["percentage", "flat"], default: "percentage" },
    discountValue: { type: Number, required: true, min: 1 },
    minOrderAmount: { type: Number, default: 0 },
    maxDiscount: { type: Number, default: null },
    expiryDate: { type: Date, default: null },
    usageLimit: { type: Number, default: null },
    usedCount: { type: Number, default: 0 },
    usedPhones: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
  },
  { ...sharedOptions, _id: false }
);

// Clear model cache in dev/reload
if (models.Coupon) {
  delete (models as any).Coupon;
}

export default (models.Coupon || model("Coupon", couponSchema, "coupons")) as any;
