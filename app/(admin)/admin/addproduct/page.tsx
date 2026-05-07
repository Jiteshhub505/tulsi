"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import axios from "axios";
import {
  productSchema,
  categories,
  form,
} from "@/validations/productValidation";
import { LogoIcon } from "@/components/logo";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function App() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
  });
  const [files, setFiles] = useState<File[]>();

  const [imageUrl, setImageUrl] = useState<string[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files ? Array.from(e.target.files) : [];
    setFiles(selected);
  };

  async function saveProduct(data: any) {
    setLoading(true);
    if (imageUrl) data.galleryImages = imageUrl;
    const response = await axios.post("/api/admin/products/addproduct  ", data);
    if (response.data.success) {
      const id = response.data.id[0].id;
      setLoading(false);
      router.replace(`/shop/${id}`);
    } else alert("Please try again");
  }

  useEffect(() => {
    setLoading(false);
  }, [imageUrl]);
  const uploadAll = async () => {
    if (!files) return alert("Undefined");
    if (files.length === 0) return alert("Select images first");

    setLoading(true);
    // 1. Get signature
    const sigRes = await fetch("/api/admin/cloudinary");
    const { signature, timestamp } = await sigRes.json();

    const uploadedUrls: string[] = [];

    // 2. Loop and upload each image
    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);
      formData.append("signature", signature);
      formData.append("timestamp", timestamp.toString());
      formData.append("folder", "products");

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await res.json();

      // Save final URL
      uploadedUrls.push(data.secure_url);
    }
    setImageUrl((prev) => [...(prev ?? []), ...uploadedUrls]);
  };

  const removeProductImage = async (url: string) => {
    setImageUrl((prev) => prev?.filter((e) => e != url));
  };

  return (
    <section className="flex min-h-screen bg-zinc-50 px-1 dark:bg-transparent">
      <form
        className="bg-white  m-auto h-fit w-full max-w-xl overflow-hidden rounded-[calc(var(--radius)+.125rem)] border shadow-md shadow-zinc-950/5 dark:[--color-muted:var(--color-zinc-900)]"
        onSubmit={handleSubmit((data) => saveProduct(data))}
      >
        <div className="bg-card -m-px rounded-[calc(var(--radius)+.125rem)] border p-8 pb-6">
          {/* TOP DIV */}
          <div className="text-center">
            <Link href="/" aria-label="go home" className="mx-auto block w-fit">
              <LogoIcon />
            </Link>
            <h1 className="mb-1 mt-4 text-xl font-semibold">
              Create a Tulsiveda Account
            </h1>
            <p className="text-sm">Welcome! Create an account to get started</p>
          </div>

          {/* Basic fields */}
          <div className="mt-6 space-y-6">
            <div>
              <div className="space-y-2">
                <Label htmlFor="name" className="block text-sm">
                  Product Name
                </Label>
                <Input {...register("name")} placeholder="Name" id="name" />
                <p>{errors.name?.message}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-6">
            <div>
              <div className="space-y-2">
                <Label htmlFor="title" className="block text-sm">
                  Product Tile
                </Label>
                <Input {...register("title")} placeholder="Title" id="title" />
                <p>{errors.title?.message}</p>
              </div>
            </div>
          </div>

          <div className="mt-1 space-y-6">
            <div>
              <div className="space-y-2">
                <Label htmlFor="price" className="block text-sm">
                  Product Price
                </Label>
                <Input
                  id="price"
                  type="number"
                  {...register("price", { valueAsNumber: true })}
                  placeholder="Price"
                />
                <p>{errors.price?.message}</p>
              </div>
            </div>
          </div>

          <div className="mt-1 space-y-6">
            <div>
              <div className="space-y-2">
                <Label htmlFor="discount" className=" block text-sm">
                  Dicount Price(if applicable)
                </Label>
                <Input
                  id="discount"
                  type="number"
                  {...register("discountPrice", { valueAsNumber: true })}
                  placeholder="Discount"
                />
                <p>{errors.discountPrice?.message}</p>
              </div>
            </div>
          </div>

          <div className="mt-1 space-y-6">
            <div>
              <div className="space-y-2">
                <Label htmlFor="discount" className=" block text-sm">
                  Available Stock Quantity
                </Label>
                <Input
                  type="number"
                  {...register("stock", { valueAsNumber: true })}
                  placeholder="Stock"
                />
                <p>{errors.stock?.message}</p>
              </div>
            </div>
          </div>

          <div className="mt-1 space-y-6">
            <div>
              <div className="space-y-2">
                <Label htmlFor="description" className=" block text-sm">
                  Detailed Description
                </Label>
                <Textarea
                  id="description"
                  className="h-[200px]"
                  {...register("description")}
                  placeholder="Description"
                />
                <p>{errors.description?.message}</p>
              </div>
            </div>
          </div>

          {/* Required Arrays */}
          <div className="mt-1 space-y-6">
            <div>
              <div className="space-y-2">
                <Label htmlFor="goal" className=" block text-sm">
                  Goal of Product
                </Label>
                <Input
                  id="goal"
                  {...register("goal")}
                  placeholder="Goal item 1 (required at least 1)"
                />
                <p>{errors.goal?.message}</p>
              </div>
            </div>
          </div>

          <div className="mt-1 space-y-6">
            <div>
              <div className="space-y-2">
                <Label htmlFor="ingredients" className=" block text-sm">
                  Ingredients of Product
                </Label>
                <Input
                  id="ingredients"
                  {...register("ingredients")}
                  placeholder="Ingredient item 1"
                />
                <p>{errors.ingredients?.message}</p>
              </div>
            </div>
          </div>

          <div className="mt-1 space-y-6">
            <div>
              <div className="space-y-2">
                <Label htmlFor="allergens" className=" block text-sm">
                  Allergens
                </Label>
                <Input
                  id="allergens"
                  {...register("allergens")}
                  placeholder="Allergen item 1"
                />
                <p>{errors.allergens?.message}</p>
              </div>
            </div>
          </div>

          <div className="mt-1 space-y-6">
            <div>
              <div className="space-y-2">
                <Label htmlFor="directions" className=" block text-sm">
                  Directions(to use)
                </Label>
                <Input
                  id="directions"
                  {...register("directions")}
                  placeholder="Directions"
                />
                <p>{errors.directions?.message}</p>
              </div>
            </div>
          </div>

          <div className="mt-1 space-y-6">
            <div>
              <div className="space-y-2">
                <Label htmlFor="certifications" className=" block text-sm">
                  Certifications
                </Label>
                <Input
                  id="certifications"
                  {...register("certifications")}
                  placeholder="Certification item 1"
                />
                <p>{errors.certifications?.message}</p>
              </div>
            </div>
          </div>

          {/* Required Dates */}
          <div className="mt-1 space-y-6">
            <div>
              <div className="space-y-2">
                <Label htmlFor="expiryDate" className=" block text-sm">
                  Expiry
                </Label>
                <Input
                  id="expiryDate"
                  type="date"
                  {...register("expiryDate")}
                />
                <p>{errors.expiryDate?.message}</p>
              </div>
            </div>
          </div>

          <div className="mt-1 space-y-6">
            <div>
              <div className="space-y-2">
                <Label htmlFor="manufacturedDate" className=" block text-sm">
                  Manufacturing Date
                </Label>
                <Input
                  id="manufacturedDate"
                  type="date"
                  {...register("manufacturedDate")}
                />
                <p>{errors.manufacturedDate?.message}</p>
              </div>
            </div>
          </div>

          {/* Selects */}
          <div className="mt-1 space-y-6">
            <div>
              <div className="space-y-2">
                <Label className=" block text-sm">Select a category</Label>
                <Select {...register("category")}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {categories.map((c, i) => (
                        <SelectItem key={i} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="mt-1 space-y-6">
            <div>
              <div className="space-y-2">
                <Label className=" block text-sm">Select medicine form</Label>
                <Select {...register("form")}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select medicine form" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {form.map((f, i) => (
                        <SelectItem key={i} value={f}>
                          {f}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="mt-1 space-y-6">
            <div>
              <div className="space-y-2">
                <Label htmlFor="galleryImage" className=" block text-sm">
                  Select Image Gallery
                </Label>
                <Input
                  id="galleryImage"
                  multiple
                  type="file"
                  accept="image/*"
                  onChange={handleSelect}
                />
                {loading ? (
                  <button className=" px-4 py-2 bg-black text-white rounded">
                    Uploading..
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={!files || loading}
                    onClick={uploadAll}
                    className="cursor-pointer px-4 py-2 bg-black text-white rounded"
                  >
                    Upload
                  </button>
                )}

                <p>{errors.manufacturedDate?.message}</p>

                {imageUrl?.map((image, index) => (
                  <div key={index} className="relative inline-block">
                    <div>
                      <img
                        src={image}
                        height={200}
                        width={200}
                        alt=""
                        className="rounded border"
                      />

                      <Button
                        variant={"ghost"}
                        className="absolute top-1 right-1"
                        onClick={() => removeProductImage(image)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            {loading ? (
              <button>Adding..</button>
            ) : (
              <button
                disabled={loading}
                className="cursor-pointer px-4 py-2 bg-black text-white rounded"
                type="submit"
              >
                Add Product
              </button>
            )}
          </div>
        </div>
      </form>
    </section>
  );
}
