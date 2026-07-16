import connectDB from "@/db/mongoose";
import { Cart, CartItem, User } from "@/db/models";
import { GUEST_USER_ID, GUEST_USER_EMAIL } from "@/lib/constants";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(req: Request) {
  await connectDB();
  try {
    const { productId, quantity } = await req.json();
    const addQty = quantity && typeof quantity === "number" && quantity > 0 ? quantity : 1;
    const session = await getServerSession(authOptions);
    //@ts-ignore
    const userId = session?.user?.id || GUEST_USER_ID;

    // Ensure guest user exists
    const guestUser = await User.findById(GUEST_USER_ID);
    if (!guestUser) {
      await User.create({
        _id: GUEST_USER_ID,
        name: "Guest User",
        email: GUEST_USER_EMAIL,
        role: "user",
      });
    }

    // 1️⃣ Get or create active cart
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
