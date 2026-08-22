import connectDB from "@/db/mongoose";
import { Product } from "@/db/models";
import { unstable_cache } from "next/cache";

export type LandingProduct = {
  id: string;
  name: string;
  nameHi?: string | null;
  title?: string;
  titleHi?: string | null;
  category: string;
  price: number;
  discountPrice: number | null;
  inStock: number | null;
  galleryImages: string[];
  isBestSeller?: boolean;
};

async function fetchProductsFromDB(): Promise<LandingProduct[]> {
  try {
    await connectDB();
    const rawProducts = await Product.find({})
      .select(
        "name nameHi title titleHi category price discountPrice inStock galleryImages isBestSeller"
      )
      .lean();

    if (!rawProducts || rawProducts.length === 0) {
      return [];
    }

    const fetchedProducts: LandingProduct[] = rawProducts.map((p: any) => ({
      id: String(p.id || p._id),
      name: p.name || p.title || "",
      nameHi: p.nameHi || p.titleHi || null,
      title: p.title || p.name || "",
      titleHi: p.titleHi || p.nameHi || null,
      category: p.category || "Health & Fitness",
      price: Number(p.price) || 0,
      discountPrice: p.discountPrice != null ? Number(p.discountPrice) : null,
      inStock: p.inStock != null ? Number(p.inStock) : null,
      galleryImages: Array.isArray(p.galleryImages) ? p.galleryImages : [],
      isBestSeller: Boolean(p.isBestSeller),
    }));

    // In-stock products first, latest added first
    const inStockProducts = fetchedProducts.filter(
      (p) => p.inStock === null || p.inStock > 0
    );
    const sortedList = [...inStockProducts].reverse();
    return sortedList.length > 0 ? sortedList : [...fetchedProducts].reverse();
  } catch (error) {
    console.error("Failed to fetch landing products from DB:", error);
    return [];
  }
}

/**
 * High-performance cached product getter for landing page SSR.
 * Uses Next.js unstable_cache with tag-based invalidation and 60s background revalidation.
 */
export const getLandingProducts = unstable_cache(
  fetchProductsFromDB,
  ["landing-products-cache"],
  {
    revalidate: 60,
    tags: ["products", "landing-products"],
  }
);
