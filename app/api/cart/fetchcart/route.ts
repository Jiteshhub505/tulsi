import connectDB from "@/db/mongoose";
import { Cart, CartItem, Product, User } from "@/db/models";
import { GUEST_USER_ID, GUEST_USER_EMAIL } from "@/lib/constants";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    await connectDB();
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

    const existingCart = await Cart.findOne({ userId, status: "active" });
    if (!existingCart)
      return NextResponse.json({ items: [], success: true });

    const cartId = existingCart.id;
    const cartItems = await CartItem.find({ cartId });
    const products = await Product.find({
      _id: { $in: cartItems.map((item: any) => item.productId) },
    });
    const productsById = new Map(products.map((p: any) => [p.id, p]));

    const items = cartItems.map((item: any) => {
      const product: any = productsById.get(item.productId);
      return {
        cartItemId: item.id,
        quantity: item.quantity,
        productId: product?.id,
        name: product?.name,
        price: product?.price,
        discountPrice: product?.discountPrice,
        image: product?.galleryImages,
      };
    });

    return NextResponse.json({ items, status: 200, success: true });
  } catch (error) {
    return NextResponse.json({
      items: [],
      success: true,
    });
  }
}

