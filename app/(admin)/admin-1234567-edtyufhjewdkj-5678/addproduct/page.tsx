"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import toast from "react-hot-toast";
import { ArrowLeft, Loader2 } from "lucide-react";

import { simpleProductSchema } from "@/validations/productValidation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductFormFields } from "@/components/admin/ProductFormFields";
import { uploadImagesToCloudinary } from "@/lib/admin/uploadImages";

export default function AddProductPage() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(simpleProductSchema),
    defaultValues: { category: "Digestion", inStock: 1 },
  });

  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

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
    } catch (error) {
      console.error(error);
      toast.error("Image upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (url: string) => {
    setImageUrls((prev) => prev.filter((image) => image !== url));
  };

  async function saveProduct(data: any) {
    if (imageUrls.length === 0) {
      toast.error("Please upload at least one product image");
      return;
    }
    if (data.discountPrice == null || Number.isNaN(data.discountPrice)) {
      delete data.discountPrice;
    }
    data.galleryImages = imageUrls;

    try {
      const response = await axios.post("/api/admin/products/addproduct", data);
      if (response.data.success) {
        toast.success("Product added successfully");
        router.replace("/admin-1234567-edtyufhjewdkj-5678/inventory");
      } else {
        toast.error(response.data.message || "Failed to add product. Please try again.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to add product. Please try again.");
    }
  }

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
          <CardTitle className="text-xl">Add a New Product</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(saveProduct)} className="space-y-6">
            <ProductFormFields
              register={register}
              errors={errors}
              setValue={setValue}
              watch={watch}
              imageUrls={imageUrls}
              onFilesSelected={setFiles}
              onUpload={handleUpload}
              onRemoveImage={handleRemoveImage}
              uploading={uploading}
              hasSelectedFiles={files.length > 0}
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="size-4 animate-spin" />}
                {isSubmitting ? "Adding..." : "Add Product"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
