import connectDB from "@/db/mongoose";
import { Product } from "@/db/models";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  // Vercel Edge Cache: serve cached in 15ms, revalidate in background
  const cacheHeaders = {
    "Cache-Control": "public, s-maxage=120, stale-while-revalidate=86400",
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

