import connectDB from "@/db/mongoose";
import { Cart, CartItem, Product } from "@/db/models";
import { getCartUserId } from "@/lib/cart/getCartUserId";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    await connectDB();
    const userId = await getCartUserId();

    const existingCart = await Cart.findOne({ userId, status: "active" }).lean();
    if (!existingCart) {
      return NextResponse.json({ items: [], success: true });
    }

    const cartId = (existingCart as any).id || (existingCart as any)._id;
    const cartItems = await CartItem.find({ cartId }).lean();
    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ items: [], success: true });
    }

    // Only fetch the exact fields the cart UI needs
    const products = await Product.find({
      _id: { $in: cartItems.map((item: any) => item.productId) },
    })
      .select("name nameHi price discountPrice galleryImages")
      .lean();

    const productsById = new Map(products.map((p: any) => [p._id || p.id, p]));

    const items = cartItems.map((item: any) => {
      const product: any = productsById.get(item.productId);
      return {
        cartItemId: item.id || item._id,
        quantity: item.quantity,
        productId: product?._id || product?.id,
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
