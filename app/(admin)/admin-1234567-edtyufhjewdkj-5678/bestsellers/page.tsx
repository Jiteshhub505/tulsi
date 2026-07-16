"use client";

import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Search, Loader2, Star, StarOff, Check } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type ProductType = {
  id: string;
  name: string;
  title: string;
  category: string;
  price: number;
  discountPrice: number | null;
  inStock: number | null;
  galleryImages: string[];
  isBestSeller?: boolean;
};

const CATEGORY_OPTIONS = [
  "All",
  "Uncategorized",
  "Health & Fitness",
  "Suppliments",
  "Skin",
  "Hygiene",
];

export default function BestSellersPage() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/admin/products/getallproducts");
      setProducts(response.data.response ?? []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleToggleBestSeller = async (productId: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    if (newStatus && bestSellersCount >= 4) {
      toast.error("You can only have up to 4 Best Sellers. Please remove one first.");
      return;
    }
    setTogglingId(productId);
    try {
      const response = await axios.patch("/api/admin/products/togglebestseller", {
        productId,
        isBestSeller: newStatus,
      });

      if (response.data.success) {
        setProducts((prev) =>
          prev.map((p) => (p.id === productId ? { ...p, isBestSeller: newStatus } : p))
        );
        toast.success(
          newStatus
            ? "Product added to Best Sellers"
            : "Product removed from Best Sellers"
        );
      } else {
        toast.error("Failed to update best seller status");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while updating status");
    } finally {
      setTogglingId(null);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        search.trim() === "" ||
        product.name?.toLowerCase().includes(search.toLowerCase()) ||
        product.title?.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "All" || product.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, category]);

  const bestSellersCount = useMemo(() => {
    return products.filter((p) => p.isBestSeller).length;
  }, [products]);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto min-h-screen bg-[#fafbfc]">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Best Sellers Management</h1>
          <p className="text-sm text-slate-500">
            Feature selected products on the landing page &ldquo;Our Best Sellers&rdquo; section.
          </p>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-xs border-slate-200">
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium text-slate-500">Total Products</CardTitle>
          </CardHeader>
          <CardContent className="-mt-2">
            <div className="text-2xl font-bold text-slate-800">
              {loading ? <Skeleton className="h-8 w-16" /> : products.length}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xs border-slate-200 bg-emerald-50/30">
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium text-emerald-700">Best Sellers Active</CardTitle>
          </CardHeader>
          <CardContent className="-mt-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-emerald-800">
                {loading ? <Skeleton className="h-8 w-16" /> : bestSellersCount}
              </span>
              {!loading && bestSellersCount > 0 && (
                <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white border-0 flex gap-1 items-center px-2 py-0.5">
                  <Star className="size-3 fill-white" /> Active
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center bg-white p-4 rounded-xl border border-slate-100 shadow-xs">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 border-slate-200 focus-visible:ring-emerald-600"
          />
        </div>

        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="sm:w-[220px] border-slate-200 focus:ring-emerald-600">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORY_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Main Table / List */}
      {loading ? (
        <Card className="border-slate-100">
          <CardContent className="p-6 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-lg" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="h-8 w-24 rounded-full" />
              </div>
            ))}
          </CardContent>
        </Card>
      ) : filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-200 bg-white py-16 text-center shadow-xs">
          <p className="text-sm font-medium text-slate-500">No products match your criteria.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/75 text-xs font-semibold uppercase text-slate-500 tracking-wider">
                  <th className="px-6 py-4">Product Info</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Inventory Status</th>
                  <th className="px-6 py-4 text-right">Best Seller</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredProducts.map((product) => {
                  const isBestseller = !!product.isBestSeller;
                  const isCurrentToggling = togglingId === product.id;
                  const displayPrice = product.discountPrice ?? product.price;

                  return (
                    <tr key={product.id} className="hover:bg-slate-50/50 transition duration-150">
                      {/* Product details */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-slate-100 border border-slate-200/50 flex-shrink-0">
                            <img
                              src={product.galleryImages?.[0] || "/tulsiveda-logo.png"}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800 line-clamp-1">{product.title || product.name}</p>
                            <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{product.name}</p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4">
                        <Badge variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-100 border-0 font-medium">
                          {product.category}
                        </Badge>
                      </td>

                      {/* Price */}
                      <td className="px-6 py-4 font-medium text-slate-800">
                        <div className="flex flex-col">
                          <span>₹{displayPrice.toLocaleString()}</span>
                          {product.discountPrice && (
                            <span className="text-xs text-slate-400 line-through">
                              ₹{product.price.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Stock status */}
                      <td className="px-6 py-4">
                        {product.inStock === null || product.inStock > 0 ? (
                          <Badge variant="outline" className="text-emerald-700 border-emerald-200 bg-emerald-50/30 hover:bg-emerald-50/30">
                            In Stock {product.inStock !== null && `(${product.inStock})`}
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-50 hover:text-rose-700">
                            Out of Stock
                          </Badge>
                        )}
                      </td>

                      {/* Best Seller Action Toggle */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end items-center">
                          <button
                            disabled={isCurrentToggling}
                            onClick={() => handleToggleBestSeller(product.id, isBestseller)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 border ${
                              isBestseller
                                ? "bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700 hover:border-emerald-700 shadow-sm"
                                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-800"
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                          >
                            {isCurrentToggling ? (
                              <>
                                <Loader2 className="size-3.5 animate-spin" />
                                <span>Updating...</span>
                              </>
                            ) : isBestseller ? (
                              <>
                                <Star className="size-3.5 fill-white text-white" />
                                <span>Best Seller</span>
                              </>
                            ) : (
                              <>
                                <StarOff className="size-3.5 text-slate-400" />
                                <span>Set Best Seller</span>
                              </>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
