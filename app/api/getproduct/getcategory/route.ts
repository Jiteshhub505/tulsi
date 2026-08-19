import connectDB from "@/db/mongoose";
import { Product } from "@/db/models";
import { NextResponse } from "next/server";

const DEFAULT_CATEGORIES = [
  "Digestion",
  "Health & Fitness",
  "Stamina and Power",
  "Health Disease",
];

export async function GET() {
  try {
    await connectDB();
    const categories = await Product.distinct("category");
    if (categories && categories.length > 0) {
      return NextResponse.json({ success: true, categories });
    }
    return NextResponse.json({ success: true, categories: DEFAULT_CATEGORIES });
  } catch (error) {
    console.error("Error getting product categories:", error);
    return NextResponse.json({ success: true, categories: DEFAULT_CATEGORIES });
  }
}
