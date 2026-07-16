import connectDB from "@/db/mongoose";
import { Product } from "@/db/models";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  await connectDB();

  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  try {
    const products = await Product.find(category ? { category } : {});

    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error("Error fetching all products:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}
