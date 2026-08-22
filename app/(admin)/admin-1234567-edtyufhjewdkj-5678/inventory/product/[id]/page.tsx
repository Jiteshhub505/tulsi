"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import toast from "react-hot-toast";
import { ArrowLeft, Loader2 } from "lucide-react";

import type { ProductType } from "../../page";
import SkeletonCard from "@/app/(profile)/profile/components/Skeleton";
import { categories, simpleProductSchema } from "@/validations/productValidation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductFormFields } from "@/components/admin/ProductFormFields";
import { uploadImagesToCloudinary } from "@/lib/admin/uploadImages";

export default function EditProductPage() {
  const [product, setProduct] = useState<ProductType | null>(null);
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(simpleProductSchema) });

  const [files, setFiles] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [imageRemoving, setImageRemoving] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/api/getproduct/${id}?t=${Date.now()}`, {
          headers: { "Cache-Control": "no-cache, no-store" },
        });
        if (res.data.success && res.data.product) {
          setProduct(res.data.product);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (!product) return;
    setImageUrls(product.galleryImages ?? []);
    const validCat = (categories as readonly string[]).includes(product.category)
      ? product.category
      : categories[0];
    reset({
      name: product.name,
      nameHi: (product as any).nameHi ?? "",
      title: product.title,
      titleHi: (product as any).titleHi ?? "",
      price: product.price,
      discountPrice: product.discountPrice ?? undefined,
      description: product.description,
      descriptionHi: (product as any).descriptionHi ?? "",
      category: validCat,
      inStock: product.inStock ?? 0,
    });
  }, [product, reset]);

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error("Select images first");
      return;
    }
    setUploading(true);
    try {
      const uploaded = await uploadImagesToCloudinary(files);
      setImageUrls((prev) => [...prev, ...uploaded].slice(0, 4));
      setFiles([]);
      toast.success("Images uploaded! Click 'Update Product' to save changes.");
    } catch (error) {
      console.error(error);
      toast.error("Image upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async (url: string) => {
    setImageRemoving(true);
    setImageUrls((prev) => prev.filter((image) => image !== url));
    try {
      const response = await axios.patch(`/api/admin/images/delete/${id}`, { data: { url } });
      if (!response.data.success) toast.error("Failed to remove image");
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove image");
    } finally {
      setImageRemoving(false);
    }
  };

  async function updateProduct(data: any) {
    if (imageUrls.length === 0) {
      toast.error("Please keep at least one product image");
      return;
    }
    if (data.discountPrice == null || Number.isNaN(data.discountPrice)) {
      delete data.discountPrice;
    }
    data.galleryImages = imageUrls;

    try {
      const response = await axios.put(`/api/admin/products/updateproduct/${id}`, data);
      if (response.data.success) {
        toast.success("Product updated successfully");
        router.replace("/admin-1234567-edtyufhjewdkj-5678/inventory");
      } else {
        toast.error(response.data.msg || "Failed to update product. Please try again.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update product. Please try again.");
    }
  }

  if (!product) return <SkeletonCard />;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Link href="/admin-1234567-edtyufhjewdkj-5678/inventory">
        <Button variant="ghost" size="sm" className="mb-4">
          <ArrowLeft className="size-4" />
          Back to Inventory
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Edit Product</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(updateProduct)} className="space-y-6">
            <ProductFormFields
              register={register}
              errors={errors}
              setValue={setValue}
              watch={watch}
              imageUrls={imageUrls}
              onFilesSelected={setFiles}
              onUpload={handleUpload}
              onRemoveImage={handleRemoveImage}
              uploading={uploading || imageRemoving}
              hasSelectedFiles={files.length > 0}
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="size-4 animate-spin" />}
                {isSubmitting ? "Updating..." : "Update Product"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
