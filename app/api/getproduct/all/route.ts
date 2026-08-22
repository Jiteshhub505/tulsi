import connectDB from "@/db/mongoose";
import { Product } from "@/db/models";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// High-speed in-memory cache to make repeated requests resolve in <1ms
let memoryCache: { products: any[]; timestamp: number } | null = null;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const now = Date.now();

  // If fetching all products and memory cache is fresh, return immediately
  if (!category && memoryCache && (now - memoryCache.timestamp < CACHE_TTL_MS)) {
    return NextResponse.json(
      { success: true, products: memoryCache.products },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  }

  try {
    await connectDB();
    const products = await Product.find(category ? { category } : {})
      .select("name nameHi title titleHi category price discountPrice inStock galleryImages isBestSeller")
      .lean();
    
    if (!category && products) {
      memoryCache = { products, timestamp: now };
    }

    return NextResponse.json(
      { success: true, products: products || [] },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching all products:", error);
    if (memoryCache?.products) {
      return NextResponse.json({ success: true, products: memoryCache.products });
    }
    return NextResponse.json({ success: false, products: [], error: "Failed to fetch products" });
  }
}


