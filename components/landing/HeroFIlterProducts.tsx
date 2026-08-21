"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart } from "lucide-react";
import axios from "axios";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/language-context";
import { getFavorites, toggleFavorite } from "@/lib/favorites";
import { getOptimizedImageUrl } from "@/lib/image-utils";

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  discountPrice: number | null;
  inStock: number | null;
  galleryImages: string[];
};

import { useQuery } from "@tanstack/react-query";

export default function HeroFIlterProducts() {
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
    staleTime: 5 * 60 * 1000,
  });

  const categories = ["Health Disease", "Digestion", "Health & Fitness", "Stamina and Power"];

  const filteredProducts = products.filter((p) => p.category === selectedCategory);

  return (
    <section className="w-full py-12 md:py-20 bg-stone-50/50 px-4 sm:px-8 md:px-12 lg:px-16 border-t border-stone-200/60">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/70 px-3 py-1 rounded-full">
              {t("Explore Products")}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3 tracking-tight">
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
                  "px-4 py-2 text-xs sm:text-sm font-semibold rounded-full transition-all cursor-pointer border",
                  selectedCategory === cat
                    ? "bg-emerald-800 text-white border-emerald-800 shadow-sm"
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
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-stone-200/80 overflow-hidden animate-pulse shadow-xs">
                <div className="aspect-square bg-stone-200" />
                <div className="p-4 space-y-3">
                  <div className="h-3 bg-stone-200 rounded w-1/3" />
                  <div className="h-4 bg-stone-200 rounded w-3/4" />
                  <div className="h-4 bg-stone-200 rounded w-1/2 mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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
                  className="group flex flex-col bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative aspect-square w-full bg-stone-100 overflow-hidden">
                    <Image
                      src={image}
                      alt={translateText(product.name)}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {discount && discount > 0 && (
                      <span className="absolute top-3 left-3 bg-emerald-700 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-xs">
                        {discount}% OFF
                      </span>
                    )}

                  </div>

                  <div className="flex flex-col flex-1 p-4">
                    <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider mb-1">
                      {t(product.category)}
                    </span>
                    <h3 className="font-semibold text-stone-900 text-sm sm:text-base leading-snug line-clamp-2 mb-3 group-hover:text-emerald-700 transition-colors">
                      {translateText(product.name, (product as any).nameHi)}
                    </h3>
                    <div className="mt-auto pt-3 border-t border-stone-100 flex items-center justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="text-base sm:text-lg font-bold text-stone-900">
                          ₹{displayPrice.toLocaleString()}
                        </span>
                        {product.discountPrice && (
                          <span className="text-xs font-medium text-stone-400 line-through">
                            ₹{product.price.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-bold text-emerald-800 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                        {t("Shop Now")} <ArrowRight size={12} />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* View All CTA */}
        <div className="mt-12 text-center">
          <Link href="/shop">
            <button className="inline-flex items-center gap-2 bg-emerald-900 hover:bg-emerald-950 text-white font-bold text-sm sm:text-base px-8 py-3.5 rounded-full transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 cursor-pointer">
              <span>{t("View All Products")}</span>
              <ArrowRight size={16} />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
