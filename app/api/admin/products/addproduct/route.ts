import connectDB from "@/db/mongoose";
import { Product } from "@/db/models";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  await connectDB();

  const {
    name,
    nameHi,
    title,
    titleHi,
    category,
    description,
    descriptionHi,
    price,
    discountPrice,
    inStock,
    galleryImages,
    form,
    goal,
    ingredients,
    allergens,
    warnings,
    directions,
    certifications,
    expiryDate,
    manufacturedDate,
    createdAt,
  } = await request.json();
  const newExpiryDate = expiryDate ? new Date(expiryDate) : undefined;
  const newManufacturedDate = manufacturedDate ? new Date(manufacturedDate) : undefined;

  try {
    const newProduct = await Product.create({
      name,
      nameHi,
      title,
      titleHi,
      category,
      description,
      descriptionHi,
      price,
      discountPrice,
      inStock,
      galleryImages,
      form,
      goal,
      ingredients,
      allergens,
      warnings,
      directions,
      certifications,
      expiryDate: newExpiryDate,
      manufacturedDate: newManufacturedDate,
      createdAt,
    });

    return NextResponse.json({
      success: true,
      id: [{ id: newProduct.id }],
      message: "Product added successfully",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      error: error,
      message: "Error adding product: Internal Server Error",
    });
  }
}
