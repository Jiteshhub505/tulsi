import connectDB from "@/db/mongoose";
import { Cart, CartItem, Product } from "@/db/models";
import { getCartUserId } from "@/lib/cart/getCartUserId";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    await connectDB();
    const userId = await getCartUserId();

    const existingCart = await Cart.findOne({ userId, status: "active" });
    if (!existingCart) {
      return NextResponse.json({ items: [], success: true });
    }

    const cartId = existingCart.id;
    const cartItems = await CartItem.find({ cartId });
    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ items: [], success: true });
    }

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
