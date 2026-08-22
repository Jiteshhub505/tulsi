"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import axios from "axios";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/language-context";
import { getFavorites } from "@/lib/favorites";
import { getOptimizedImageUrl } from "@/lib/image-utils";
import { useQuery } from "@tanstack/react-query";

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  discountPrice: number | null;
  inStock: number | null;
  galleryImages: string[];
};

interface HeroFIlterProductsProps {
  initialProducts?: Product[];
}

export default function HeroFIlterProducts({ initialProducts = [] }: HeroFIlterProductsProps) {
  const { t, translateText } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>("Health Disease");
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    setFavorites(getFavorites());
    const handleUpdate = () => setFavorites(getFavorites());
    window.addEventListener("favorites-updated", handleUpdate);
    return () => window.removeEventListener("favorites-updated", handleUpdate);
  }, []);

  const { data: products = [], isLoading: loading } = useQuery<Product[]>({
    queryKey: ["all-products"],
    queryFn: async () => {
      const res = await axios.get("/api/getproduct/all");
      if (res.data.success) {
        const list = (res.data.products || []).map((p: any) => ({
          ...p,
          id: p.id || p._id,
        }));
        return [...list].reverse();
      }
      return [];
    },
    initialData: initialProducts.length > 0 ? initialProducts : undefined,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const categories = ["Health Disease", "Digestion", "Health & Fitness", "Stamina and Power"];

  const filteredProducts = products.filter((p) => p.category === selectedCategory);

  return (
    <section className="w-full py-8 sm:py-12 md:py-20 bg-stone-50/50 px-3 sm:px-6 md:px-12 lg:px-16 border-t border-stone-200/60">
      <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto">
        {/* Heading */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 md:gap-6 mb-8">
          <div>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/70 px-3 py-1 rounded-full">
              {t("Explore Products")}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl 2xl:text-5xl font-extrabold text-slate-900 mt-2 tracking-tight">
              {t("Shop Top Ayurveda Formulas")}
            </h2>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-bold rounded-full transition-all cursor-pointer border",
                  selectedCategory === cat
                    ? "bg-emerald-800 text-white border-emerald-800 shadow-xs"
                    : "bg-white text-stone-700 border-stone-200 hover:border-emerald-700/50 hover:text-emerald-800"
                )}
              >
                {t(cat)}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8 2xl:gap-10">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl border border-stone-200/80 overflow-hidden animate-pulse shadow-xs">
                <div className="aspect-square bg-stone-200" />
                <div className="p-3 sm:p-5 space-y-2">
                  <div className="h-3 bg-stone-200 rounded w-1/3" />
                  <div className="h-4 bg-stone-200 rounded w-3/4" />
                  <div className="h-4 bg-stone-200 rounded w-1/2 mt-3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8 2xl:gap-10">
            {filteredProducts.slice(0, 8).map((product, idx) => {
              const prodId = product.id || (product as any)._id || `prod-${idx}`;
              const discount = product.discountPrice
                ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
                : null;
              const displayPrice = product.discountPrice ?? product.price;
              const image = getOptimizedImageUrl(product.galleryImages?.[0], { width: 600 });

              return (
                <Link
                  key={prodId}
                  href={`/shop/${prodId}`}
                  prefetch={true}
                  className="group flex flex-col bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl border border-stone-200/80 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative aspect-square w-full bg-stone-100 overflow-hidden">
                    <Image
                      src={image}
                      alt={translateText(product.name)}
                      fill
                      loading="lazy"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {discount && discount > 0 && (
                      <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-emerald-700 text-white text-[10px] sm:text-xs lg:text-sm font-extrabold px-2 py-0.5 sm:px-3 sm:py-1 rounded-full shadow-xs">
                        {discount}% OFF
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col flex-1 p-3 sm:p-5 lg:p-6">
                    <span className="text-[10px] sm:text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1.5">
                      {t(product.category)}
                    </span>
                    <h3 className="font-bold text-slate-900 text-xs sm:text-base lg:text-xl 2xl:text-2xl leading-snug line-clamp-2 mb-2 sm:mb-3 group-hover:text-emerald-700 transition-colors min-h-[2.2rem] sm:min-h-[2.8rem]">
                      {translateText(product.name, (product as any).nameHi)}
                    </h3>
                    <div className="mt-auto pt-3 border-t border-stone-100 flex items-center justify-between gap-1.5">
                      <div className="flex items-baseline gap-1 sm:gap-2">
                        <span className="text-base sm:text-xl lg:text-2xl 2xl:text-3xl font-extrabold text-stone-900">
                          ₹{displayPrice.toLocaleString()}
                        </span>
                        {product.discountPrice && (
                          <span className="text-[10px] sm:text-xs lg:text-sm font-semibold text-stone-400 line-through">
                            ₹{product.price.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] sm:text-xs lg:text-sm font-bold text-emerald-800 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                        {t("Shop Now")} <ArrowRight className="size-3 sm:size-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* View All CTA */}
        <div className="mt-10 text-center">
          <Link href="/shop">
            <button className="inline-flex items-center gap-2 bg-emerald-900 hover:bg-emerald-950 text-white font-bold text-xs sm:text-base px-6 sm:px-8 py-3 sm:py-3.5 rounded-full transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 cursor-pointer">
              <span>{t("View All Products")}</span>
              <ArrowRight className="size-4 sm:size-5" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
