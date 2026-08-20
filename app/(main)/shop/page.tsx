"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import {
  SlidersHorizontal,
  Search,
  ArrowRight,
  X,
  ChevronDown,
  Leaf,
  Dumbbell,
  ShieldCheck,
  Droplets,
  Star,
  ShoppingCart,
  Filter,
  Grid3X3,
  List,
  Sparkles,
  Tag,
  PackageCheck,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────
type Product = {
  id?: string;
  _id?: string;
  name: string;
  title: string;
  category: string;
  price: number;
  discountPrice: number | null;
  inStock: number | null;
  galleryImages: string[];
  form: string | null;
  goal: string[] | null;
};

import { useLanguage } from "@/context/language-context";


// ─── Static category config ────────────────────────────────────────
const CATEGORY_CONFIG: Record<
  string,
  { labelKey: string; icon: React.ReactNode; color: string; bg: string }
> = {
  All: {
    labelKey: "All Products",
    icon: <Sparkles size={16} />,
    color: "text-emerald-700",
    bg: "bg-emerald-50",
  },
  Digestion: {
    labelKey: "Digestion",
    icon: <Leaf size={16} />,
    color: "text-emerald-700",
    bg: "bg-emerald-50",
  },
  "Health & Fitness": {
    labelKey: "Health & Fitness",
    icon: <ShieldCheck size={16} />,
    color: "text-blue-700",
    bg: "bg-blue-50",
  },
  "Stamina and Power": {
    labelKey: "Stamina and Power",
    icon: <Dumbbell size={16} />,
    color: "text-purple-700",
    bg: "bg-purple-50",
  },
  "Health Disease": {
    labelKey: "Health Disease",
    icon: <Droplets size={16} />,
    color: "text-rose-700",
    bg: "bg-rose-50",
  },
};

// Category image map for the top category pills
const CATEGORY_IMAGES: Record<string, string> = {
  Digestion: "/digestion.png",
  "Health & Fitness": "/health&fitness.png",
  "Stamina and Power": "/staminaandpower.png",
  "Health Disease": "/healthdisease.png",
};

const SORT_OPTIONS = [
  { value: "featured", labelKey: "Featured" },
  { value: "price-asc", labelKey: "Price: Low to High" },
  { value: "price-desc", labelKey: "Price: High to Low" },
  { value: "discount", labelKey: "Best Discount" },
  { value: "name", labelKey: "Name A–Z" },
];

// ─── Skeleton card ─────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl overflow-hidden animate-pulse">
      <div className="aspect-square bg-gradient-to-br from-stone-100 to-stone-200" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-stone-100 rounded w-2/3" />
        <div className="h-4 bg-stone-200 rounded w-3/4" />
        <div className="flex items-center justify-between mt-3">
          <div className="h-5 bg-stone-100 rounded w-1/3" />
          <div className="h-4 bg-stone-100 rounded w-1/4" />
        </div>
      </div>
    </div>
  );
}

// ─── Product card ──────────────────────────────────────────────────
import { useQuery } from "@tanstack/react-query";
import { isFavorite, toggleFavorite } from "@/lib/favorites";

function ProductCard({ product }: { product: Product }) {
  const { t, translateText } = useLanguage();
  const [fav, setFav] = useState(false);
  const prodId = product.id || product._id || "";

  useEffect(() => {
    setFav(isFavorite(prodId));
    const handleUpdate = () => setFav(isFavorite(prodId));
    window.addEventListener("favorites-updated", handleUpdate);
    return () => window.removeEventListener("favorites-updated", handleUpdate);
  }, [prodId]);

  const handleFavClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(prodId);
  };

  const discount = product.discountPrice
    ? Math.round(
        ((product.price - product.discountPrice) / product.price) * 100,
      )
    : null;
  const displayPrice = product.discountPrice ?? product.price;
  const image = product.galleryImages?.[0] ?? "/tulsiveda-logo.png";
  const catConfig = CATEGORY_CONFIG[product.category] ?? CATEGORY_CONFIG["Digestion"];

  // Deterministic rating per product ID
  const rating = useMemo(() => {
    let hash = 0;
    for (let i = 0; i < prodId.length; i++) {
      hash = prodId.charCodeAt(i) + ((hash << 5) - hash);
    }
    return (4.5 + (Math.abs(hash) % 5) / 10).toFixed(1);
  }, [prodId]);

  return (
    <Link
      href={`/shop/${prodId}`}
      className="group flex flex-col bg-gradient-to-br from-amber-50/30 to-stone-100/50 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 relative"
    >
      {/* Image */}
      <div className="relative aspect-square w-full overflow-hidden bg-gradient-to-br from-stone-100 to-amber-100/30">
        <Image
          src={image}
          alt={translateText(product.name)}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Discount Badge */}
        {discount && (
          <div className="absolute top-3 left-3 bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-md shadow-md">
            {discount}% off
          </div>
        )}
        

        {product.inStock === 0 && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] flex items-center justify-center">
            <span className="text-sm font-semibold text-stone-700 bg-white px-4 py-2 rounded-lg shadow-sm">
              {t("Out of Stock")}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-4 bg-white">
        <span className={`text-[10px] font-medium uppercase tracking-wide mb-1.5 ${catConfig.color}`}>
          {t(catConfig.labelKey)}
        </span>
        
        <h3 className="font-semibold text-stone-800 text-sm group-hover:text-emerald-700 transition-colors leading-snug line-clamp-2 mb-2 min-h-[2.5rem]">
          {translateText(product.name, (product as any).nameHi)}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={12}
                className={i < Math.floor(Number(rating)) ? "fill-amber-400 text-amber-400" : "text-stone-300"}
              />
            ))}
          </div>
          <span className="text-xs font-semibold text-stone-700">{rating}</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mt-auto">
          <span className="text-lg font-bold text-stone-900">
            ₹{displayPrice.toLocaleString()}
          </span>
          {product.discountPrice && (
            <span className="text-sm text-stone-400 line-through">
              ₹{product.price.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────
function ShopPageContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get('category');
  
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Set category from URL parameter on mount
  useEffect(() => {
    if (categoryFromUrl && categoryFromUrl !== "All") {
      setSelectedCategory(categoryFromUrl);
    }
  }, [categoryFromUrl]);

  // Fetch products with React Query for instant memory caching on back navigation
  const { data: products = [], isLoading: loading } = useQuery<Product[]>({
    queryKey: ["all-products"],
    queryFn: async () => {
      const res = await axios.get("/api/getproduct/all");
      return res.data.success ? res.data.products : [];
    },
    staleTime: 10 * 60 * 1000,
  });

  const { data: categories = [] } = useQuery<string[]>({
    queryKey: ["all-categories"],
    queryFn: async () => {
      const res = await axios.get("/api/getproduct/getcategory");
      return res.data.success ? res.data.categories : [];
    },
    staleTime: 10 * 60 * 1000,
  });

  // Dynamic max price
  const maxPrice = useMemo(() => {
    if (!products.length) return 5000;
    return Math.max(...products.map((p) => p.price));
  }, [products]);

  useEffect(() => {
    setPriceRange([0, maxPrice]);
  }, [maxPrice]);

  // Filtered + sorted
  const filtered = useMemo(() => {
    let list = [...products];

    // category
    if (selectedCategory !== "All") {
      list = list.filter((p) => p.category === selectedCategory);
    }

    // search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.title?.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q),
      );
    }

    // price
    list = list.filter((p) => {
      const price = p.discountPrice ?? p.price;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // in-stock
    if (inStockOnly) {
      list = list.filter((p) => p.inStock === null || p.inStock > 0);
    }

    // sort
    switch (sortBy) {
      case "price-asc":
        list.sort(
          (a, b) => (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price),
        );
        break;
      case "price-desc":
        list.sort(
          (a, b) => (b.discountPrice ?? b.price) - (a.discountPrice ?? a.price),
        );
        break;
      case "discount":
        list.sort((a, b) => {
          const da = a.discountPrice
            ? ((a.price - a.discountPrice) / a.price) * 100
            : 0;
          const db = b.discountPrice
            ? ((b.price - b.discountPrice) / b.price) * 100
            : 0;
          return db - da;
        });
        break;
      case "name":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return list;
  }, [products, selectedCategory, search, priceRange, inStockOnly, sortBy]);

  // Predefined primary revamp categories
  const primaryCategories = [
    "Digestion",
    "Health & Fitness",
    "Stamina and Power",
    "Health Disease",
  ];
  
  const ALLOWED = new Set(primaryCategories);
  const filteredFetchedCategories = categories.filter((c) => ALLOWED.has(c));

  const mergedCategories = Array.from(
    new Set([...primaryCategories, ...filteredFetchedCategories])
  );
  
  const allCategories = ["All", ...mergedCategories];

  // ─── Sidebar content ─────────────────────────────────────────────
  const SidebarContent = () => (
    <div className="space-y-6">
      {/* Category Filter */}
      <div>
        <h3 className="text-sm font-bold text-stone-900 mb-3 flex items-center gap-2">
          <div className="w-1 h-5 bg-emerald-600 rounded-full" />
          {t("By Categories")}
        </h3>
        <div className="space-y-1">
          {allCategories.map((cat) => {
            const config = CATEGORY_CONFIG[cat] ?? CATEGORY_CONFIG["Digestion"];
            const isActive = selectedCategory === cat;
            const count =
              cat === "All"
                ? products.length
                : products.filter((p) => p.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  isActive
                    ? "bg-emerald-700 text-white"
                    : "text-stone-700 hover:bg-stone-100"
                }`}
              >
                <span className="flex items-center gap-2">
                  {config.icon}
                  {t(config.labelKey)}
                </span>
                <span className={`text-xs ${isActive ? "text-white/80" : "text-stone-400"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-stone-200" />

      {/* Price Range */}
      <div>
        <h3 className="text-sm font-bold text-stone-900 mb-3 flex items-center gap-2">
          <div className="w-1 h-5 bg-emerald-600 rounded-full" />
          {t("Price")}
        </h3>
        <div className="space-y-4">
          <input
            type="range"
            min={0}
            max={maxPrice}
            value={priceRange[1]}
            onChange={(e) =>
              setPriceRange([priceRange[0], Number(e.target.value)])
            }
            className="w-full h-2 rounded-full accent-emerald-600 cursor-pointer"
            style={{
              background: `linear-gradient(to right, #059669 0%, #059669 ${(priceRange[1] / maxPrice) * 100}%, #e7e5e4 ${(priceRange[1] / maxPrice) * 100}%, #e7e5e4 100%)`
            }}
          />
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-stone-700">
              ₹{priceRange[0].toLocaleString()}
            </span>
            <span className="text-stone-400">—</span>
            <span className="font-medium text-stone-700">
              ₹{priceRange[1].toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-stone-200" />

      {/* Availability */}
      <div>
        <h3 className="text-sm font-bold text-stone-900 mb-3 flex items-center gap-2">
          <div className="w-1 h-5 bg-emerald-600 rounded-full" />
          {t("Availability")}
        </h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="w-4 h-4 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
            />
            <span className="text-sm text-stone-700 group-hover:text-emerald-700 transition-colors">
              {t("In Stock")}
            </span>
          </label>
        </div>
      </div>

      {/* Reset */}
      {(selectedCategory !== "All" ||
        inStockOnly ||
        priceRange[1] !== maxPrice) && (
        <>
          <div className="h-px bg-stone-200" />
          <button
            onClick={() => {
              setSelectedCategory("All");
              setInStockOnly(false);
              setPriceRange([0, maxPrice]);
            }}
            className="w-full text-sm font-semibold text-emerald-700 hover:text-emerald-800 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-emerald-50 transition-all cursor-pointer"
          >
            <X size={14} />
            {t("Clear All")}
          </button>
        </>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-50">
      {/* ── Body ───────────────────────────────────────── */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* ── Desktop Sidebar ─────────────────────────── */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-8 bg-white rounded-lg border border-stone-200 p-5">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-stone-200">
                <SlidersHorizontal size={18} className="text-emerald-600" />
                <span className="font-bold text-stone-900">{t("Filter Options")}</span>
              </div>
              <SidebarContent />
            </div>
          </aside>

          {/* ── Main Content ────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="bg-white rounded-lg border border-stone-200 p-4 mb-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {/* Mobile filter button */}
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="lg:hidden flex items-center gap-2 px-4 py-2 bg-emerald-700 text-white rounded-lg text-sm font-semibold hover:bg-emerald-800 transition-all cursor-pointer"
                  >
                    <Filter size={16} />
                    {t("Filters")}
                  </button>

                  {/* Result count */}
                  <span className="text-sm text-stone-600">
                    {t("Showing")} <span className="font-semibold text-stone-900">{filtered.length}</span> {t("products")}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {/* Sort */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-stone-600 hidden sm:block">{t("Sort by:")}</span>
                    <div className="relative">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="appearance-none bg-white border border-stone-300 rounded-lg text-sm text-stone-700 pl-3 pr-10 py-2 cursor-pointer hover:border-emerald-600 transition-all outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        {SORT_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {t(opt.labelKey)}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={16}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Active filters chips */}
              {(selectedCategory !== "All" || inStockOnly || search) && (
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-stone-200">
                  <span className="text-xs text-stone-600 font-medium">{t("Active Filter:")}</span>
                  {selectedCategory !== "All" && (
                    <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-medium px-3 py-1 rounded-full border border-emerald-200">
                      {
                        t(
                          (
                            CATEGORY_CONFIG[selectedCategory] ??
                            CATEGORY_CONFIG["Digestion"]
                          ).labelKey
                        )
                      }
                      <button
                        onClick={() => setSelectedCategory("All")}
                        className="cursor-pointer hover:text-emerald-900"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  )}
                  {inStockOnly && (
                    <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-medium px-3 py-1 rounded-full border border-emerald-200">
                      {t("In Stock")}
                      <button
                        onClick={() => setInStockOnly(false)}
                        className="cursor-pointer hover:text-emerald-900"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  )}
                  {search && (
                    <span className="inline-flex items-center gap-1.5 bg-stone-200 text-stone-700 text-xs font-medium px-3 py-1 rounded-full">
                      "{search}"
                      <button
                        onClick={() => setSearch("")}
                        className="cursor-pointer hover:text-stone-900"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  )}
                  <button
                    onClick={() => {
                      setSelectedCategory("All");
                      setSearch("");
                      setInStockOnly(false);
                    }}
                    className="text-xs text-stone-500 hover:text-emerald-700 font-medium underline cursor-pointer"
                  >
                    {t("Clear All")}
                  </button>
                </div>
              )}
            </div>

            {/* Product Grid */}
            {loading ? (
              <div className="grid gap-4 sm:gap-5 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4 bg-white rounded-lg border border-stone-200">
                <div className="w-20 h-20 rounded-full bg-stone-100 flex items-center justify-center">
                  <Search size={32} className="text-stone-400" />
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-stone-900">
                    {t("No products found")}
                  </p>
                  <p className="text-sm text-stone-500 mt-1">
                    {t("Try adjusting your filters or search terms.")}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedCategory("All");
                    setSearch("");
                    setInStockOnly(false);
                    setPriceRange([0, maxPrice]);
                  }}
                  className="mt-2 px-6 py-2.5 bg-emerald-700 text-white text-sm font-semibold rounded-lg hover:bg-emerald-800 transition-all cursor-pointer"
                >
                  {t("Clear All Filters")}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {filtered.map((product, idx) => {
                  const prodKey = product.id || product._id || idx;
                  return <ProductCard key={prodKey} product={product} />;
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile Sidebar Drawer ───────────────────────── */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          {/* Drawer */}
          <div className="relative ml-auto w-[320px] h-full bg-white shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-stone-200 bg-emerald-700">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={18} className="text-white" />
                <span className="font-bold text-white">{t("Filter Options")}</span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-white hover:text-stone-200 p-1 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-5">
              <SidebarContent />
            </div>
          </div>
        </div>
      )}


      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-500">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-700 mb-4"></div>
        <span>Loading Shop...</span>
      </div>
    }>
      <ShopPageContent />
    </Suspense>
  );
}
