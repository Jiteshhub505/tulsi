import connectDB from "@/db/mongoose";
import { Product } from "@/db/models";
import { NextResponse } from "next/server";

export async function PATCH(request: Request) {
  await connectDB();

  try {
    const { productId, isBestSeller } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { success: false, message: "Product ID is required" },
        { status: 400 }
      );
    }

    if (isBestSeller) {
      const currentCount = await Product.countDocuments({
        isBestSeller: true,
        _id: { $ne: productId },
      });
      if (currentCount >= 4) {
        return NextResponse.json(
          {
            success: false,
            message: "Limit reached. You can only have up to 4 Best Sellers. Please remove one first.",
          },
          { status: 400 }
        );
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { isBestSeller: !!isBestSeller },
      { new: true }
    );

    if (!updatedProduct) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      product: updatedProduct,
      message: "Product best seller status updated successfully",
    });
  } catch (error: any) {
    console.error("Error toggling best seller status:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
