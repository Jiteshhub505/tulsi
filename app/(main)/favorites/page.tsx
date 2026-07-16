"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ArrowRight } from "lucide-react";
import axios from "axios";
import { getFavorites, toggleFavorite } from "@/lib/favorites";
import toast from "react-hot-toast";

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  discountPrice: number | null;
  inStock: number | null;
  galleryImages: string[];
};

export default function FavoritesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("/api/getproduct/all");
      if (response.data.success) {
        setProducts(response.data.products || []);
      }
    } catch (err) {
      console.error("Error fetching products", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    setFavoriteIds(getFavorites());
    const handleUpdate = () => setFavoriteIds(getFavorites());
    window.addEventListener("favorites-updated", handleUpdate);
    return () => window.removeEventListener("favorites-updated", handleUpdate);
  }, []);

  const favoriteProducts = products.filter((p) => favoriteIds.includes(p.id));

  return (
    <div className="min-h-screen bg-[#f9fcfb] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-stone-205 pb-5">
          <Heart className="size-8 text-rose-500 fill-rose-500" />
          <h1 className="text-3xl font-extrabold text-stone-905 tracking-tight">My Favorites</h1>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse border border-stone-105">
                <div className="aspect-square bg-stone-200"></div>
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-stone-200 rounded w-1/3"></div>
                  <div className="h-6 bg-stone-200 rounded"></div>
                  <div className="h-4 bg-stone-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : favoriteProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 max-w-md mx-auto">
            <div className="size-16 bg-stone-100 rounded-full flex items-center justify-center text-stone-400">
              <Heart className="size-8" />
            </div>
            <h2 className="text-xl font-bold text-stone-905">Your favorites list is empty</h2>
            <p className="text-sm text-stone-500 leading-relaxed">
              Explore our premium collection of Ayurvedic products and save your favorites here.
            </p>
            <Link href="/shop">
              <button className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-6 py-3 rounded-xl transition cursor-pointer text-sm shadow-md">
                Browse Shop
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {favoriteProducts.map((product) => {
              const discount = product.discountPrice
                ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
                : null;
              const displayPrice = product.discountPrice ?? product.price;
              const image = product.galleryImages?.[0] ?? "/tulsiveda-logo.png";

              return (
                <div key={product.id} className="relative">
                  <Link
                    href={`/shop/${product.id}`}
                    className="group flex flex-col bg-white rounded-2xl border border-stone-100 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full"
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
                        <span className="absolute top-4 left-4 bg-rose-500 text-white text-xs font-bold py-1.5 px-3 rounded-full shadow-sm">
                          {discount}% OFF
                        </span>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col flex-1 p-5">
                      <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-1.5">
                        {product.category}
                      </span>
                      <h3 className="font-semibold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors leading-snug line-clamp-2 mb-3 min-h-[2.5rem]">
                        {product.name}
                      </h3>
                      
                      {/* Pricing & CTA */}
                      <div className="mt-auto pt-4 border-t border-stone-50 flex items-center justify-between">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="text-base font-bold text-slate-900">₹{displayPrice.toLocaleString()}</span>
                            {product.discountPrice && (
                              <span className="text-xs font-medium text-slate-400 line-through">
                                ₹{product.price.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 group-hover:bg-emerald-700 group-hover:text-white transition-all duration-300">
                          <ArrowRight size={14} />
                        </div>
                      </div>
                    </div>
                  </Link>

                  {/* Remove Favorite Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleFavorite(product.id);
                      toast.success("Removed from favorites");
                    }}
                    className="absolute top-4 right-4 w-8 h-8 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-sm cursor-pointer z-10"
                    aria-label="Remove from favorites"
                  >
                    <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
