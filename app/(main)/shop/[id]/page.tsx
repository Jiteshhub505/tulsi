import SingleProduct from "@/components/shopping/SingleProduct";
import connectDB from "@/db/mongoose";
import { Product } from "@/db/models";
import { notFound } from "next/navigation";
import { getOptimizedImageUrl } from "@/lib/image-utils";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    await connectDB();
    const product = await Product.findById(id).lean();
    if (!product) return { title: "Product | Tulsi Veda" };
    return {
      title: `${(product as any).name || (product as any).title} | Tulsi Veda`,
      description: (product as any).description?.slice(0, 160),
      openGraph: {
        images: (product as any).galleryImages?.[0]
          ? [getOptimizedImageUrl((product as any).galleryImages[0])]
          : [],
      },
    };
  } catch {
    return { title: "Product | Tulsi Veda" };
  }
}

export const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  let initialProduct: any = null;
  try {
    await connectDB();
    const doc = await Product.findById(id).lean();
    if (doc) {
      initialProduct = JSON.parse(JSON.stringify(doc));
    }
  } catch (err) {
    console.error("Server product fetch error:", err);
  }

  if (!initialProduct) {
    return notFound();
  }

  const heroImage = getOptimizedImageUrl(initialProduct.galleryImages?.[0], { width: 1000 });

  return (
    <>
      {/* High-priority Preload tag directly in head for instant 0ms image fetch */}
      <link rel="preload" as="image" href={heroImage} fetchPriority="high" />
      <SingleProduct id={id} initialProduct={initialProduct} />
    </>
  );
};

export default page;

