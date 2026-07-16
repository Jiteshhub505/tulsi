import { Schema, models, model } from "mongoose";
import { uuid, sharedOptions } from "./_shared";

export const CATEGORIES = [
  "Uncategorized",
  "Health & Fitness",
  "Suppliments",
  "Skin",
  "Hygiene",
] as const;

export const MEDICINE_TYPES = ["powder", "capsule", "tablet", "liquid"] as const;

const productSchema = new Schema(
  {
    _id: { type: String, default: uuid },
    name: { type: String, required: true },
    title: { type: String, required: true },
    category: { type: String, enum: CATEGORIES, default: "Uncategorized", required: true },
    description: { type: String, default: null },

    price: { type: Number, required: true },
    discountPrice: { type: Number, default: null },

    inStock: { type: Number, default: null },

    galleryImages: { type: [String], default: [] },

    // Supplement-specific
    form: { type: String, default: null },
    goal: { type: [String], default: undefined },
    ingredients: { type: [String], default: undefined },
    allergens: { type: [String], default: undefined },

    // Regulatory
    warnings: { type: [String], default: undefined },
    directions: { type: String, default: null },
    certifications: { type: [String], default: undefined },

    expiryDate: { type: Date, default: null },
    manufacturedDate: { type: Date, default: null },
    medicineType: { type: String, enum: MEDICINE_TYPES, default: "capsule" },
    createdAt: { type: Date, default: Date.now },
    isBestSeller: { type: Boolean, default: false },
  },
  { ...sharedOptions, _id: false },
);

export default models.Product || model("Product", productSchema, "products");
