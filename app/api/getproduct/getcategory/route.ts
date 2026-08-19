import connectDB from "@/db/mongoose";
import { Product } from "@/db/models";
import { NextResponse } from "next/server";

const ALLOWED_CATEGORIES = [
  "Digestion",
  "Health & Fitness",
  "Stamina and Power",
  "Health Disease",
];

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({
      success: true,
      categories: ALLOWED_CATEGORIES,
    });
  } catch (error) {
    console.error("Error getting product categories:", error);
    return NextResponse.json({ success: true, categories: ALLOWED_CATEGORIES });
  }
}
