import { Schema, models, model } from "mongoose";
import { uuid, sharedOptions } from "./_shared";

const ratingSchema = new Schema(
  {
    _id: { type: String, default: uuid },
    userId: { type: String, required: true },
    productId: { type: String, required: true },
    rating: { type: Number, required: true }, // 1-5
    comment: { type: String, default: null },
    createdAt: { type: Date, default: Date.now },
  },
  { ...sharedOptions, _id: false },
);

export default models.Rating || model("Rating", ratingSchema, "ratings");
