"use client";

import type { ChangeEvent } from "react";
import type { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { Loader2, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { categories } from "@/validations/productValidation";

export const MAX_IMAGES = 4;

export type ProductFormFieldsProps = {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  setValue: UseFormSetValue<any>;
  watch: UseFormWatch<any>;
  imageUrls: string[];
  onFilesSelected: (files: File[]) => void;
  onUpload: () => void;
  onRemoveImage: (url: string) => void;
  uploading: boolean;
  hasSelectedFiles: boolean;
};

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-sm text-red-500">{message}</p>;
}

export function ProductFormFields({
  register,
  errors,
  setValue,
  watch,
  imageUrls,
  onFilesSelected,
  onUpload,
  onRemoveImage,
  uploading,
  hasSelectedFiles,
}: ProductFormFieldsProps) {
  const categoryValue = watch("category");
  const slotsLeft = MAX_IMAGES - imageUrls.length;

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files ? Array.from(e.target.files).slice(0, Math.max(slotsLeft, 0)) : [];
    onFilesSelected(selected);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Product Name</Label>
          <Input id="name" placeholder="e.g. Ayurvedic Weight Gainer" {...register("name")} />
          <FieldError message={errors.name?.message as string} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="title">Product Title</Label>
          <Input id="title" placeholder="Short marketing title" {...register("title")} />
          <FieldError message={errors.title?.message as string} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Price (₹)</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            placeholder="e.g. 599"
            {...register("price", { valueAsNumber: true })}
          />
          <FieldError message={errors.price?.message as string} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="discountPrice">Discount Price (₹) — optional</Label>
          <Input
            id="discountPrice"
            type="number"
            step="0.01"
            placeholder="e.g. 499"
            {...register("discountPrice", { valueAsNumber: true })}
          />
          <FieldError message={errors.discountPrice?.message as string} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          className="h-[140px]"
          placeholder="What is this product, and why should someone buy it?"
          {...register("description")}
        />
        <FieldError message={errors.description?.message as string} />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Category</Label>
          <Select
            value={categoryValue ?? undefined}
            onValueChange={(value) => setValue("category", value, { shouldValidate: true })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <FieldError message={errors.category?.message as string} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="inStock">Stock Quantity</Label>
          <Input
            id="inStock"
            type="number"
            placeholder="e.g. 25 (0 for Out of Stock)"
            {...register("inStock", { valueAsNumber: true })}
          />
          <FieldError message={errors.inStock?.message as string} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="galleryImage">
          Product Images ({imageUrls.length}/{MAX_IMAGES}) — at least 1 required
        </Label>
        <Input
          id="galleryImage"
          multiple
          type="file"
          accept="image/*"
          disabled={slotsLeft <= 0}
          onChange={handleFileChange}
        />

        <Button type="button" variant="outline" disabled={!hasSelectedFiles || uploading || slotsLeft <= 0} onClick={onUpload}>
          {uploading && <Loader2 className="size-4 animate-spin" />}
          {uploading ? "Uploading..." : "Upload Selected Images"}
        </Button>

        {imageUrls.length > 0 && (
          <div className="flex flex-wrap gap-3 pt-2">
            {imageUrls.map((image) => (
              <div key={image} className="relative inline-block">
                <img src={image} alt="" className="h-[110px] w-[110px] rounded border object-cover" />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon-sm"
                  className="absolute top-1 right-1"
                  onClick={() => onRemoveImage(image)}
                >
                  <X className="size-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
