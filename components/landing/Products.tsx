"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/context/language-context";
import { getOptimizedImageUrl } from "@/lib/image-utils";

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  discountPrice: number | null;
  inStock: number | null;
  galleryImages: string[];
  isBestSeller?: boolean;
};

export default function Products() {
  const { t, translateText } = useLanguage();

  const { data: products = [], isLoading: loading } = useQuery<Product[]>({
    queryKey: ["all-products"],
    queryFn: async () => {
      const response = await axios.get("/api/getproduct/all");
      if (response.data.success) {
        const fetchedProducts = (response.data.products || []).map((p: any) => ({
          ...p,
          id: p.id || p._id,
        }));
        const inStockProducts = fetchedProducts.filter(
          (p: Product) => p.inStock === null || p.inStock > 0
        );
        const sortedList = [...inStockProducts].reverse();
        return sortedList.length > 0 ? sortedList : [...fetchedProducts].reverse();
      }
      return [];
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  if (loading || products.length === 0) {
    return null;
  }

  return (
    <section id="bestsellers" className="w-full py-8 sm:py-12 md:py-20 bg-[#f9fcfb] px-3 sm:px-6 md:px-12 lg:px-16 border-t border-emerald-950/5">
      <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto space-y-8 sm:space-y-12">

        {/* Section Heading */}
        <div className="text-center space-y-2 sm:space-y-3 max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl 2xl:text-5xl font-extrabold tracking-tight text-slate-900">
            {t("Our Products")}
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm md:text-base 2xl:text-lg font-medium leading-relaxed">
            {t("Best Sellers Subtitle")}
          </p>
        </div>

        {/* 4-Product Responsive Grid (Clean medium size on mobile, scales up nicely on large screens) */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8 2xl:gap-10">
          {products.map((product, index) => {
            const productId = product.id || (product as any)._id || `product-${index}`;
            const discount = product.discountPrice
              ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
              : null;
            const displayPrice = product.discountPrice ?? product.price;
            const image = getOptimizedImageUrl(product.galleryImages?.[0], { width: 600, quality: "auto:good" });

            return (
              <Link
                key={productId}
                href={`/shop/${productId}`}
                prefetch={true}
                className="group flex flex-col bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl border border-gray-100 overflow-hidden shadow-xs hover:shadow-xl hover:shadow-emerald-950/10 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Image Container */}
                <div className="relative aspect-square w-full overflow-hidden bg-slate-50">
                  <Image
                    src={image}
                    alt={translateText(product.name)}
                    fill
                    priority={index < 4}
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Discount Badge */}
                  {discount && discount > 0 && (
                    <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-rose-500 text-white text-[10px] sm:text-xs lg:text-sm font-extrabold py-0.5 px-2 sm:py-1 sm:px-3 rounded-full shadow-xs z-10">
                      {discount}% OFF
                    </span>
                  )}
                </div>

                {/* Product Info */}
                <div className="flex flex-col flex-1 p-3 sm:p-5 lg:p-6">
                  <span className="text-[10px] sm:text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1.5">
                    {t(product.category)}
                  </span>

                  <h3 className="font-bold text-slate-900 text-xs sm:text-base lg:text-xl 2xl:text-2xl group-hover:text-emerald-700 transition-colors leading-snug line-clamp-2 mb-2 sm:mb-3 min-h-[2.2rem] sm:min-h-[2.8rem]">
                    {translateText(product.name, (product as any).nameHi)}
                  </h3>

                  {/* Pricing & CTA */}
                  <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between gap-1.5">
                    <div className="flex flex-col">
                      <div className="flex items-baseline gap-1 sm:gap-2">
                        <span className="text-base sm:text-xl lg:text-2xl 2xl:text-3xl font-extrabold text-slate-900">
                          ₹{displayPrice.toLocaleString()}
                        </span>
                        {product.discountPrice && (
                          <span className="text-[10px] sm:text-xs lg:text-sm font-semibold text-slate-400 line-through">
                            ₹{product.price.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 2xl:h-14 2xl:w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 group-hover:bg-emerald-700 group-hover:text-white transition-all duration-300 shadow-2xs shrink-0">
                      <ArrowRight className="size-3.5 sm:size-4 lg:size-5 2xl:size-6 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
