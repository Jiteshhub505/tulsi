import connectDB from "@/db/mongoose";
import { Product } from "@/db/models";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// In-memory cache per product ID: { [id]: { product, timestamp } }
const productCache: Record<string, { product: any; timestamp: number }> = {};
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Serve from memory cache if fresh
  const now = Date.now();
  if (productCache[id] && now - productCache[id].timestamp < CACHE_TTL_MS) {
    return NextResponse.json(
      { product: productCache[id].product, success: true },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  }

  try {
    await connectDB();
    // Select only fields the single product page actually uses
    const product = await Product.findById(id)
      .select(
        "name nameHi title titleHi category description descriptionHi price discountPrice inStock galleryImages isBestSeller form goal ingredients allergens warnings directions certifications expiryDate manufacturedDate medicineType benefits clinicalStats keyIngredients howToUseSteps faqs packOptions"
      )
      .lean();

    if (product) {
      productCache[id] = { product, timestamp: now };
    }

    return NextResponse.json(
      { product, success: true },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (error) {
    console.log("error getting products....", error);
    // Serve stale cache on error
    if (productCache[id]) {
      return NextResponse.json(
        { product: productCache[id].product, success: true },
        { headers: { "Cache-Control": "no-store" } }
      );
    }
    return NextResponse.json({ error, success: false });
  }
}
