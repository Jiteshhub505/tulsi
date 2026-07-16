"use client";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";

export type ProductType = {
  id: string;

  name: string;
  title: string;
  category:
    | "Uncategorized"
    | "Health & Fitness"
    | "Suppliments"
    | "Skin"
    | "Hygiene";
  medicineType: "powder" | "capsule" | "tablet" | "liquid";
  form: string;

  description: string;
  directions: string;
  warnings: string | null;

  price: number;
  discountPrice: number | null;

  inStock: number | null;

  allergens: string;
  ingredients: string;
  certifications: string;
  goal: string;

  galleryImages: string[];

  manufacturedDate: string; // ISO
  expiryDate: string; // ISO
  createdAt: string; // ISO
};

const CATEGORY_OPTIONS = [
  "All",
  "Uncategorized",
  "Health & Fitness",
  "Suppliments",
  "Skin",
  "Hygiene",
];

const Page = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [pendingDelete, setPendingDelete] = useState<ProductType | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchAllProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/admin/products/getallproducts");
      setProducts(response.data.response ?? []);
    } catch (error) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      setDeleting(true);
      const response = await axios.delete("/api/admin/products/deleteproduct", {
        data: { productId: id },
      });
      if (response.data.success) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        toast.success("Product deleted");
      } else {
        toast.error("Failed to delete product");
      }
    } catch (error) {
      toast.error("Failed to delete product");
    } finally {
      setDeleting(false);
      setPendingDelete(null);
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

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

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold">Inventory</h2>
          <p className="text-sm text-muted-foreground">Manage your product catalog</p>
        </div>

        <Link href="/admin-1234567-edtyufhjewdkj-5678/addproduct">
          <Button>
            <Plus className="size-4" />
            Add Product
          </Button>
        </Link>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:max-w-xs"
        />

        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="sm:w-[220px]">
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

      {loading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardHeader>
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardFooter className="gap-2">
                <Skeleton className="h-8 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {!loading && products.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed py-16 text-center">
          <p className="text-sm text-muted-foreground">No products yet — add your first one</p>
          <Link href="/admin-1234567-edtyufhjewdkj-5678/addproduct">
            <Button>
              <Plus className="size-4" />
              Add Product
            </Button>
          </Link>
        </div>
      )}

      {!loading && products.length > 0 && filteredProducts.length === 0 && (
        <p className="text-sm text-muted-foreground py-10 text-center">No products match your filters</p>
      )}

      {!loading && filteredProducts.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <img
                src={product.galleryImages?.[0]}
                alt={product.title}
                className="h-48 w-full object-cover"
              />

              <CardHeader className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="secondary">{product.category}</Badge>
                  {!product.inStock ? (
                    <Badge variant="destructive">Out of stock</Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground">In stock: {product.inStock}</span>
                  )}
                </div>

                <CardTitle className="text-base line-clamp-2">{product.title || product.name}</CardTitle>
                <CardDescription className="text-sm line-clamp-2">{product.description}</CardDescription>
              </CardHeader>

              <CardContent>
                <div className="flex items-baseline gap-2">
                  {product.discountPrice ? (
                    <>
                      <span className="text-sm text-muted-foreground line-through">₹{product.price}</span>
                      <span className="text-base font-semibold">₹{product.discountPrice}</span>
                    </>
                  ) : (
                    <span className="text-base font-semibold">₹{product.price}</span>
                  )}
                </div>
              </CardContent>

              <CardFooter className="flex items-center justify-between gap-2">
                <Link href={`/admin-1234567-edtyufhjewdkj-5678/inventory/product/${product.id}`} className="flex-1">
                  <Button size="sm" className="w-full">Edit</Button>
                </Link>
                <Button
                  size="icon-sm"
                  variant="outline"
                  onClick={() => setPendingDelete(product)}
                  aria-label="Delete product"
                >
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!pendingDelete} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete product?</DialogTitle>
            <DialogDescription>
              This will permanently delete{" "}
              <span className="font-medium">{pendingDelete?.title || pendingDelete?.name}</span> and cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPendingDelete(null)} disabled={deleting}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={deleting}
              onClick={() => pendingDelete && deleteProduct(pendingDelete.id)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Page;
