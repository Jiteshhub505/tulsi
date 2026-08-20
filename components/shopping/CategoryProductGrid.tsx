"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

import { useLanguage } from "@/context/language-context";

type Product = {
  id: string;
  name: string;
  title: string;
  description: string;
  price: number;
  discountPrice: number | null;
  inStock: number | null;
  galleryImages: string[];
};

type CategoryProductGridProps = {
  category: string;
  heading: string;
  subheading?: string;
};

export default function CategoryProductGrid({
  category,
  heading,
  subheading,
}: CategoryProductGridProps) {
  const { t, translateText } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/getproduct/all", {
          params: { category },
        });
        if (res.data.success) setProducts(res.data.products ?? []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* Heading */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold lg:text-4xl">{t(heading)}</h2>
          {subheading && <p className="mt-4 text-muted-foreground">{t(subheading)}</p>}
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-80 w-full" />
                <CardContent className="pt-4 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && products.length === 0 && (
          <p className="text-center text-muted-foreground">
            {t("No products in this category yet — check back soon.")}
          </p>
        )}

        {/* Grid */}
        {!loading && products.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product, idx) => {
              const prodId = product.id || (product as any)._id || idx;
              const inStock = product.inStock === null || product.inStock === undefined || product.inStock > 0;
              const displayPrice = product.discountPrice ?? product.price;
              const image = product.galleryImages?.[0] ?? "/tulsiveda-logo.png";

              return (
                <Link
                  key={prodId}
                  href={`/shop/${prodId}`}
                >
                  <Card
                    className={cn(
                      "cursor-pointer group relative overflow-hidden transition hover:shadow-lg",
                      !inStock && "opacity-80",
                    )}
                  >
                    {/* IMAGE */}
                    <div className="relative h-80 w-full overflow-hidden">
                      <Image
                        src={image}
                        alt={translateText(product.title || product.name)}
                        fill
                        className={cn(
                          "object-cover transition-transform group-hover:scale-105",
                          !inStock && "blur-sm",
                        )}
                      />

                      {/* OUT OF STOCK OVERLAY */}
                      {!inStock && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40">
                          <span className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white">
                            {t("Out of Stock")}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* CONTENT */}
                    <CardContent className="pt-4">
                      <h3 className="text-lg font-semibold">{translateText(product.name, (product as any).nameHi)}</h3>
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                        {translateText(product.description, (product as any).descriptionHi)}
                      </p>
                    </CardContent>

                    {/* FOOTER */}
                    <CardFooter className="flex items-center justify-between">
                      <span className="text-lg font-semibold">₹{displayPrice}</span>
                      <span
                        className={cn(
                          "inline-flex items-center justify-center rounded-md text-xs font-semibold px-4 py-2 transition-colors",
                          inStock
                            ? "bg-emerald-700 text-white group-hover:bg-emerald-800"
                            : "bg-stone-200 text-stone-500 cursor-not-allowed"
                        )}
                      >
                        {inStock ? t("View Product") : t("Unavailable")}
                      </span>
                    </CardFooter>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
