import { NextResponse } from "next/server";

import connectDB from "@/db/mongoose";
import { Product, Rating, CartItem, OrderItem } from "@/db/models";

export const DELETE = async (req: Request) => {
  await connectDB();

  try {
    // (auth check removed per project-wide auth removal — do not reintroduce)
    const { productId } = await req.json();
    if (!productId) {
      return NextResponse.json(
        { success: false, message: "productId required" },
        { status: 400 },
      );
    }

    // delete dependents first, then the product (no transaction — standalone Mongo)
    await Rating.deleteMany({ productId });
    await CartItem.deleteMany({ productId });
    await OrderItem.deleteMany({ product_id: productId });
    await Product.findByIdAndDelete(productId);

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Failed to delete product" },
      { status: 500 },
    );
  }
};
