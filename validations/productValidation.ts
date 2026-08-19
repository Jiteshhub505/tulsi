import * as z from "zod";

export const categories = [
  "Digestion",
  "Health & Fitness",
  "Stamina and Power",
  "Health Disease",
] as const;

export const form = ["powder", "capsule", "tablet", "liquid"] as const;

export const productSchema = z.object({
  name: z.string().min(4, "Name is required"),
  nameHi: z.string().optional(),
  title: z.string().min(10, "Title must be atleas 10 words"),
  titleHi: z.string().optional(),
  price: z.number().min(0, "Price is required"),

  discountPrice: z.number().positive().optional(),

  description: z.string().min(50, "Description is required"),
  descriptionHi: z.string().optional(),
  stock: z.number().min(0, "Stock cannot be negative"),

  category: z.enum(categories).default("Digestion"),
  form: z.enum(form).default("capsule"),

  inStock: z.number().default(1),

  galleryImages: z
    .string()
    .transform((val) => val.split(",").map((s) => s.trim()))
    .optional(),
  goal: z.string().transform((val) => val.split(",").map((s) => s.trim())),
  ingredients: z
    .string()
    .transform((val) => val.split(",").map((s) => s.trim())),
  allergens: z.string().transform((val) => val.split(",").map((s) => s.trim())),
  directions: z.string().min(1, "Directions are required"),
  certifications: z
    .string()
    .transform((val) => val.split(",").map((s) => s.trim())),

  expiryDate: z.coerce.date(),
  manufacturedDate: z.coerce.date(),
});

export type ProductInput = z.infer<typeof productSchema>;

// Simplified schema used by the admin Add/Edit Product forms — only name,
// title, price, description and category are required; discountPrice and
// gallery images are handled separately (images require at least 1, up to
// 4, enforced in the form itself rather than via zod).
export const simpleProductSchema = z.object({
  name: z.string().min(2, "Name is required"),
  nameHi: z.string().optional(),
  title: z.string().min(4, "Title is required"),
  titleHi: z.string().optional(),
  price: z.number().min(0, "Price is required"),
  discountPrice: z.number().min(0).optional(),
  description: z.string().min(10, "Description is required"),
  descriptionHi: z.string().optional(),
  category: z.enum(categories).default("Digestion"),
  inStock: z.number().min(0, "Stock cannot be negative").default(1),
  benefits: z.array(z.object({ title: z.string(), desc: z.string(), icon: z.string().optional() })).optional(),
  clinicalStats: z.array(z.object({ percentage: z.number(), label: z.string() })).optional(),
  keyIngredients: z.array(z.object({ name: z.string(), desc: z.string(), image: z.string().optional() })).optional(),
  howToUseSteps: z.array(z.object({ step: z.number(), title: z.string(), desc: z.string() })).optional(),
  faqs: z.array(z.object({ question: z.string(), answer: z.string() })).optional(),
  packOptions: z.array(z.object({ packName: z.string(), price: z.number(), discountPrice: z.number().optional(), isPopular: z.boolean().optional() })).optional(),
});

export type SimpleProductInput = z.infer<typeof simpleProductSchema>;
