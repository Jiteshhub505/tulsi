"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import he from "he";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import getproductdetails from "./actions/getproductdetals";
import { useEffect, useState } from "react";
import { Star, Check, Shield, Heart } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { isFavorite, toggleFavorite } from "@/lib/favorites";
import { useLanguage } from "@/context/language-context";

// ---------------- TYPES ----------------
export type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  discountPrice: number | null;
  inStock: boolean;
  title: string;
  ingredients: string[];
  allergens: string[];
  goal: string[];
  certifications: string[];
  directions: string;
  form: string;
  manufacturedDate: string;
  expiryDate: string;
  galleryImages: string[];
  warnings: string | null;
};

// ---------------- COMPONENT ----------------
export default function SingleProduct({ id }: { id: string }) {
  const { status } = useSession();
  const { t, translateText } = useLanguage();
  const router = useRouter();

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery<Product>({
    queryKey: ["product", id],
    queryFn: () => getproductdetails(id),
    staleTime: 5 * 60 * 1000,
  });

  // Fetch related products
  const {
    data: relatedProducts,
    isLoading: relatedLoading,
  } = useQuery<Product[]>({
    queryKey: ["related-products", product?.category],
    queryFn: async () => {
      if (!product?.category) return [];
      const response = await axios.get("/api/getproduct/all", {
        params: { category: product.category },
      });
      if (response.data.success) {
        // Filter products from same category, exclude current product, limit to 4
        return response.data.products
          .filter((p: Product) => p.category === product.category && p.id !== id)
          .slice(0, 4);
      }
      return [];
    },
    enabled: !!product?.category,
    staleTime: 5 * 60 * 1000,
  });

  const selectedImage = product?.galleryImages?.[0] ?? "";

  // ---------------- STATES ----------------
  const [activeImage, setActiveImage] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [fav, setFav] = useState(false);

  useEffect(() => {
    if (product) {
      setFav(isFavorite(product.id));
    }
    const handleUpdate = () => {
      if (product) {
        setFav(isFavorite(product.id));
      }
    };
    window.addEventListener("favorites-updated", handleUpdate);
    return () => window.removeEventListener("favorites-updated", handleUpdate);
  }, [product]);

  const handleFavClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product) {
      toggleFavorite(product.id);
    }
  };

  const handleAddToBag = async () => {
    if (status !== "authenticated") {
      toast.error("Please login to add products to cart");
      router.push("/auth/signin");
      return;
    }

    setIsAdding(true);
    try {
      const response = await axios.post("/api/cart/addtocart", {
        productId: product?.id,
        quantity,
      });

      if (response.data.success) {
        toast.success("Added to cart!");
        window.dispatchEvent(new Event("cart-updated"));
      } else {
        toast.error("Failed to add to cart");
      }
    } catch (error) {
      toast.error("Error adding to cart");
    } finally {
      setIsAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (status !== "authenticated") {
      toast.error("Please login to proceed with purchase");
      router.push("/auth/signin");
      return;
    }

    setIsAdding(true);
    try {
      const response = await axios.post("/api/cart/addtocart", {
        productId: product?.id,
        quantity,
      });

      if (response.data.success) {
        window.dispatchEvent(new Event("cart-updated"));
        router.push("/cart");
      } else {
        toast.error("Failed to add to cart");
      }
    } catch (error) {
      toast.error("Error processing request");
    } finally {
      setIsAdding(false);
    }
  };

  useEffect(() => {
    if (product?.galleryImages?.length) {
      setActiveImage(product.galleryImages[0]);
    }
  }, [product]);

  // ---------------- LOADING / ERROR ----------------
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-100 to-amber-50/30 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-700"></div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-100 to-amber-50/30 flex items-center justify-center">
        <p className="text-stone-600">Failed to load product</p>
      </div>
    );
  }

  const rating = 4.9;
  const reviewCount = 1234;
  const discount = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  // ---------------- RENDER ----------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-100 to-amber-50/30">
      {/* Breadcrumb */}
      <div className="border-b border-stone-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-sm text-stone-600">
            <Link href="/" className="hover:text-stone-900 transition-colors">{t("Home")}</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-stone-900 transition-colors uppercase">{t(product.category)}</Link>
            <span>/</span>
            <span className="text-stone-900 font-medium">{translateText(product.name)}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
          
          {/* LEFT COLUMN: Gallery & Main Image */}
          <div className="flex flex-col-reverse md:flex-row gap-4 items-stretch w-full lg:h-full">
            {/* Gallery Thumbnails */}
            <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto max-w-full md:max-h-[550px] md:w-20 shrink-0 pb-2 md:pb-0 scrollbar-thin">
              {product.galleryImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(img)}
                  className={`relative w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                    activeImage === img
                      ? "border-emerald-600 shadow-xs"
                      : "border-stone-200 hover:border-stone-400"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`thumbnail-${i}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Main Image Container */}
            <div 
              onClick={() => setIsZoomed(true)}
              className="relative w-full aspect-square lg:aspect-auto rounded-2xl overflow-hidden flex items-center justify-center max-h-[350px] sm:max-h-[450px] md:max-h-[550px] lg:max-h-none lg:h-full group flex-1 cursor-zoom-in"
            >
              <Image
                src={activeImage || selectedImage}
                alt={translateText(product.name)}
                fill
                className="object-contain transition-transform duration-500 group-hover:scale-102"
                priority
              />
            </div>
          </div>

          {/* RIGHT COLUMN: PRODUCT INFO */}
          <div className="space-y-6">
            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 leading-tight">
              {translateText(product.name)}
            </h1>
            
            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < Math.floor(rating) ? "fill-stone-900 text-stone-900" : "fill-stone-300 text-stone-300"}
                  />
                ))}
              </div>
              <span className="text-sm text-stone-700">{rating} · {reviewCount.toLocaleString()} {t("Customer Reviews")}</span>
            </div>

            {/* Sub-Title */}
            <p className="text-sm text-stone-600 leading-relaxed font-medium">
              {translateText(product.title)}
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-x-6 gap-y-3 py-3 border-y border-stone-200">
              <div className="flex items-center gap-2 text-xs text-stone-700 font-semibold">
                <Shield size={16} className="text-emerald-700" />
                <span>{t("TRUSTED BY DOCTORS")}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-stone-700 font-semibold">
                <Check size={16} className="text-emerald-700" />
                <span>{t("EASY TO USE")}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-stone-700 font-semibold">
                <svg className="w-4 h-4 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>{t("CERTIFIED QUALITY")}</span>
              </div>
            </div>

            {/* Full Description with 3-lines clamp and Read More toggle */}
            {product.description && (
              <div className="space-y-2">
                <div className={`text-sm text-stone-700 leading-relaxed transition-all duration-300 ${!isExpanded ? "line-clamp-3 overflow-hidden" : ""}`}>
                  {translateText(he.decode(product.description))}
                </div>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors uppercase tracking-wider focus:outline-hidden cursor-pointer"
                >
                  {isExpanded ? t("Read Less") : t("Read More")}
                </button>
              </div>
            )}

            {/* Price */}
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-stone-900">
                  ₹{(product.discountPrice || product.price).toLocaleString()}
                </span>
                {product.discountPrice && (
                  <span className="text-lg text-stone-400 line-through">
                    ₹{product.price.toLocaleString()}
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-500">{t("Inclusive of all taxes")}</p>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-stone-900 uppercase tracking-wide">{t("QUANTITY:")}</h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg border-2 border-stone-300 flex items-center justify-center hover:border-stone-900 transition-colors cursor-pointer"
                >
                  <span className="text-xl text-stone-700">−</span>
                </button>
                <span className="text-lg font-semibold text-stone-900 min-w-[40px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-lg border-2 border-stone-300 flex items-center justify-center hover:border-stone-900 transition-colors cursor-pointer"
                >
                  <span className="text-xl text-stone-700">+</span>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4 pt-2">
              <button 
                disabled={isAdding || !product.inStock}
                onClick={handleAddToBag}
                className="flex-1 bg-emerald-50/50 hover:bg-emerald-100/50 border-2 border-emerald-700 disabled:bg-stone-100 disabled:border-stone-300 disabled:text-stone-400 disabled:cursor-not-allowed text-emerald-850 font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer text-sm uppercase"
              >
                {isAdding ? t("Adding to Cart...") : t("Add to Cart")}
              </button>

              <button 
                disabled={isAdding || !product.inStock}
                onClick={handleBuyNow}
                className="flex-1 bg-emerald-700 hover:bg-emerald-800 disabled:bg-stone-300 disabled:cursor-not-allowed disabled:shadow-none text-white font-bold py-4 rounded-xl transition-all shadow-md shadow-emerald-700/10 cursor-pointer flex items-center justify-center gap-2 text-sm uppercase"
              >
                {!product.inStock ? t("Out of Stock") : t("Buy Now")}
              </button>

              <button 
                onClick={handleFavClick}
                className="w-14 h-14 bg-stone-105 border border-stone-200 rounded-xl flex items-center justify-center hover:bg-stone-200 transition-all cursor-pointer shadow-xs shrink-0"
                aria-label="Add to Wishlist"
              >
                <Heart className={`w-6 h-6 transition-colors ${fav ? "text-rose-500 fill-rose-500" : "text-stone-600"}`} />
              </button>
            </div>

            <p className="text-xs text-center text-stone-500">
              {t("Satisfaction Guaranteed • Free Shipping Over ₹500 • Secure Check-Out")}
            </p>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-stone-900 mb-6">{t("Related Products")}</h2>
          {relatedLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="bg-stone-100 rounded-xl aspect-square animate-pulse"></div>
              ))}
            </div>
          ) : relatedProducts && relatedProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {relatedProducts.map((relatedProduct) => {
                const discount = relatedProduct.discountPrice
                  ? Math.round(
                      ((relatedProduct.price - relatedProduct.discountPrice) / relatedProduct.price) * 100
                    )
                  : null;
                const displayPrice = relatedProduct.discountPrice ?? relatedProduct.price;
                const image = relatedProduct.galleryImages?.[0] ?? "/tulsiveda-logo.png";

                return (
                  <Link
                    key={relatedProduct.id}
                    href={`/shop/${relatedProduct.id}`}
                    className="group flex flex-col bg-white rounded-xl border border-stone-200 overflow-hidden hover:shadow-lg transition-all duration-300"
                  >
                    <div className="relative aspect-square bg-stone-100">
                      <Image
                        src={image}
                        alt={translateText(relatedProduct.name)}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {discount && discount > 0 && (
                        <div className="absolute top-2 right-2 bg-emerald-700 text-white text-xs font-bold px-2 py-1 rounded">
                          {discount}% OFF
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold text-sm text-stone-900 line-clamp-2 mb-2 group-hover:text-emerald-700 transition-colors">
                        {translateText(relatedProduct.name)}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-stone-900">
                          ₹{displayPrice.toLocaleString()}
                        </span>
                        {relatedProduct.discountPrice && (
                          <span className="text-xs text-stone-400 line-through">
                            ₹{relatedProduct.price.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <p className="text-stone-500 text-center py-8">{t("No products found")}</p>
          )}
        </div>
      </div>

      {isZoomed && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center cursor-zoom-out"
          onClick={() => setIsZoomed(false)}
        >
          <div className="relative w-[90vw] h-[90vh] max-w-4xl max-h-[80vh]">
            <Image
              src={activeImage || selectedImage}
              alt={product.name}
              fill
              className="object-contain"
              priority
            />
            {/* Close button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsZoomed(false);
              }}
              className="absolute top-4 right-4 text-white hover:text-stone-300 bg-white/10 p-2 rounded-full backdrop-blur-xs transition cursor-pointer"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
