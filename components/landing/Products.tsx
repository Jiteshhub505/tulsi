"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star, Heart } from "lucide-react";
import axios from "axios";
import { getFavorites, toggleFavorite } from "@/lib/favorites";

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
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    setFavorites(getFavorites());
    const handleUpdate = () => setFavorites(getFavorites());
    window.addEventListener("favorites-updated", handleUpdate);
    return () => window.removeEventListener("favorites-updated", handleUpdate);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/getproduct/all");
        if (response.data.success) {
          // Filter products that are marked as best seller and in-stock
          const displayProducts = response.data.products.filter(
            (p: Product) => p.isBestSeller && (p.inStock === null || p.inStock > 0)
          );
          setProducts(displayProducts);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (!loading && products.length === 0) {
    return null;
  }

  if (loading) {
    return (
      <section id="bestsellers" className="w-full py-20 bg-[#f9fcfb] px-6 md:px-12 lg:px-16 border-t border-emerald-950/5">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <h2 className="text-3xl md:text-4xl lg:text-[40px] font-bold tracking-tight text-slate-900">
              Our Best Sellers
            </h2>
            <p className="text-slate-500 text-sm md:text-base font-medium">
              Premium quality formulations crafted from time-tested Ayurvedic ingredients.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 md:gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-square bg-stone-200"></div>
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-stone-200 rounded w-2/3"></div>
                  <div className="h-6 bg-stone-200 rounded"></div>
                  <div className="h-4 bg-stone-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="bestsellers" className="w-full py-10 md:py-20 bg-[#f9fcfb] px-4 md:px-12 lg:px-16 border-t border-emerald-950/5">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Section Heading */}
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-[40px] font-bold tracking-tight text-slate-900">
            Our Best Sellers
          </h2>
          <p className="text-slate-500 text-sm md:text-base font-medium">
            Premium quality formulations crafted from time-tested Ayurvedic ingredients.
          </p>
        </div>

        {/* 4-Product Responsive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 md:gap-8">
          {products.map((product) => {
            const discount = product.discountPrice
              ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
              : null;
            const displayPrice = product.discountPrice ?? product.price;
            const image = product.galleryImages?.[0] ?? "/tulsiveda-logo.png";
            
            return (
              <Link 
                key={product.id} 
                href={`/shop/${product.id}`}
                className="group flex flex-col bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Image Container */}
                <div className="relative aspect-square w-full overflow-hidden bg-slate-50">
                  <Image
                    src={image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  {/* Discount Badge */}
                  {discount && discount > 0 && (
                    <span className="hidden sm:block absolute bottom-4 left-4 bg-rose-500 text-white text-xs font-bold py-1.5 px-3 rounded-full shadow-sm">
                      {discount}% OFF
                    </span>
                  )}

                  {/* Wishlist Heart */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleFavorite(product.id);
                    }}
                    className="absolute top-4 right-4 w-8 h-8 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-sm cursor-pointer z-10"
                  >
                    <Heart
                      className={`w-4 h-4 transition-colors ${
                        favorites.includes(product.id) ? "text-rose-500 fill-rose-500" : "text-stone-600"
                      }`}
                    />
                  </button>
                </div>

                {/* Product Info */}
                <div className="flex flex-col flex-1 p-3 sm:p-5 md:p-6">
                  <span className="text-xs font-medium text-emerald-600 uppercase tracking-wider mb-2">
                    {product.category}
                  </span>
                  <h3 className="font-semibold text-slate-900 text-sm sm:text-lg group-hover:text-emerald-700 transition-colors leading-snug line-clamp-2 mb-2 sm:mb-3">
                    {product.name}
                  </h3>
                  
                  {/* Pricing & CTA */}
                  <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="text-base sm:text-xl font-bold text-slate-900">₹{displayPrice.toLocaleString()}</span>
                        {product.discountPrice && (
                          <span className="text-sm font-medium text-slate-400 line-through">
                            ₹{product.price.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 group-hover:bg-emerald-700 group-hover:text-white transition-all duration-300">
                      <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
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
