import connectDB from "@/db/mongoose";
import { Product } from "@/db/models";
import { NextRequest, NextResponse } from "next/server";

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
    
    return NextResponse.json({ success: true, products: products || [] }, { headers: cacheHeaders });
  } catch (error) {
    console.error("Error fetching all products:", error);
    return NextResponse.json({ success: false, products: [], error: "Failed to fetch products" }, { headers: cacheHeaders });
  }
}

