import connectDB from "@/db/mongoose";
import { Cart, CartItem } from "@/db/models";
import { getCartUserId } from "@/lib/cart/getCartUserId";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await connectDB();
  try {
    const { productId, quantity } = await req.json();
    const addQty = quantity && typeof quantity === "number" && quantity > 0 ? quantity : 1;
    const userId = await getCartUserId();

    // 1️⃣ Get or create active cart for this unique user / device
    let existingCart = await Cart.findOne({ userId, status: "active" });
    if (!existingCart) {
      existingCart = await Cart.create({ userId, status: "active" });
    }
    const cartId = existingCart.id;

    // 2️⃣ Check item
    const item = await CartItem.findOne({ cartId, productId });

    if (item) {
      item.quantity += addQty;
      await item.save();
    } else {
      await CartItem.create({
        cartId,
        productId,
        quantity: addQty,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("ADD_TO_CART_ERROR", err);
    return NextResponse.json(
      { message: "Error adding to cart" },
      { status: 500 }
    );
  }
}
