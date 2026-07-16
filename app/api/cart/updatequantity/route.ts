import connectDB from "@/db/mongoose";
import { CartItem } from "@/db/models";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  await connectDB();
  const { productId, productQuantity, cartItemId } = await req.json();
  try {
    await CartItem.updateOne(
      { _id: cartItemId, productId },
      { quantity: productQuantity }
    );

    return NextResponse.json({ message: "Succesfully updated", success: true });
  } catch (error) {
    return NextResponse.json({
      error,
      message: "Internal server error",
      success: false,
    });
  }
}
