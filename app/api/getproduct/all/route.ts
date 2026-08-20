import connectDB from "@/db/mongoose";
import { Product } from "@/db/models";
import { NextRequest, NextResponse } from "next/server";

const FALLBACK_PRODUCTS = [
  {
    id: "fb-1",
    _id: "fb-1",
    name: "Ayurvedic Fat Burner",
    title: "Ayurvedic Fat Burner - Metabolism & Energy Support",
    category: "Digestion",
    price: 600,
    discountPrice: 499,
    inStock: 25,
    description: "An Ayurvedic formulation designed to support metabolism and active daily routines when combined with proper diet and exercise.",
    galleryImages: ["/digestion.png"],
    isBestSeller: true,
  },
  {
    id: "fb-2",
    _id: "fb-2",
    name: "Ayurvedic Weight Gainer",
    title: "Ayurvedic Weight Gainer - Daily Nutrition Support",
    category: "Health & Fitness",
    price: 600,
    discountPrice: 499,
    inStock: 25,
    description: "Supports daily nutrition and active lifestyles.",
    galleryImages: ["/health&fitness.png"],
    isBestSeller: true,
  },
  {
    id: "fb-3",
    _id: "fb-3",
    name: "Veda Shakti",
    title: "Veda Shakti - Natural Power & Stamina Support",
    category: "Stamina and Power",
    price: 1299,
    discountPrice: 999,
    inStock: 15,
    description: "Carefully selected Ayurvedic ingredients to support overall energy, stamina, and power.",
    galleryImages: ["/staminaandpower.png"],
    isBestSeller: true,
  },
  {
    id: "fb-4",
    _id: "fb-4",
    name: "Piles Care Formula",
    title: "Piles Care Formula - Relief & Comfort Support",
    category: "Health Disease",
    price: 899,
    discountPrice: 699,
    inStock: 20,
    description: "A traditional Ayurvedic blend designed to support daily digestive health and relief.",
    galleryImages: ["/healthdisease.png"],
    isBestSeller: true,
  },
];

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  const cacheHeaders = {
    "Cache-Control": "no-store, max-age=0, must-revalidate",
  };

  try {
    await connectDB();
    const products = await Product.find(category ? { category } : {}).lean();
    
    if (products && products.length > 0) {
      return NextResponse.json({ success: true, products }, { headers: cacheHeaders });
    }

    const filteredFallback = category
      ? FALLBACK_PRODUCTS.filter((p) => p.category === category)
      : FALLBACK_PRODUCTS;

    return NextResponse.json({ success: true, products: filteredFallback }, { headers: cacheHeaders });
  } catch (error) {
    console.error("Error fetching all products:", error);
    const filteredFallback = category
      ? FALLBACK_PRODUCTS.filter((p) => p.category === category)
      : FALLBACK_PRODUCTS;
    return NextResponse.json({ success: true, products: filteredFallback }, { headers: cacheHeaders });
  }
}
