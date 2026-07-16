import connectDB from "@/db/mongoose";
import { Product } from "@/db/models";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();

  try {
    const categories = await Product.distinct("category");

    return NextResponse.json({ success: true, categories });
  } catch (error) {
    console.error("Error getting product categories:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch categories" },
      { status: 500 },
    );
  }
}
