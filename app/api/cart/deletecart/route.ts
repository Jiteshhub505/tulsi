import connectDB from "@/db/mongoose";
import { CartItem } from "@/db/models";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  await connectDB();
  const { cartItemId, productId } = await req.json();
  try {
    await CartItem.deleteOne({
      _id: String(cartItemId),
      productId: String(productId),
    });

    return NextResponse.json({
      message: "Succesfully removed product from cart",
      success: true,
    });
  } catch (error) {
    return NextResponse.json({
      error,
      message: "Error removing product from cart: Internal server error",
      success: true,
    });
  }
}
