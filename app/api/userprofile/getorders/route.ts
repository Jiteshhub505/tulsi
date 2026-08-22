import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/db/mongoose";
import { Order, OrderItem, Product } from "@/db/models";
import { GUEST_USER_ID } from "@/lib/constants";

export async function GET(req: Request) {
  await connectDB();
  try {
    const { searchParams } = new URL(req.url);
    const phoneParam = searchParams.get("phone")?.replace(/\D/g, "").slice(-10) || "";
    const session = await getServerSession(authOptions);
    //@ts-ignore
    const id = session?.user?.id;

    const orConditions: any[] = [];
    if (id && id !== GUEST_USER_ID) {
      orConditions.push({ user_id: id });
    }
    if (phoneParam) {
      orConditions.push({ "shippingDetails.phone": new RegExp(phoneParam + "$") });
    }
    if (orConditions.length === 0) {
      orConditions.push({ user_id: GUEST_USER_ID });
    }

    const orders = await Order.find({ $or: orConditions })
      .sort({ createdAt: -1 })
      .lean();

    if (orders.length === 0) {
      return NextResponse.json([]);
    }

    // Batch fetch all order items in one query (no N+1)
    const orderIds = orders.map((o: any) => o.order_id);
    const allOrderItems = await OrderItem.find({ order_id: { $in: orderIds } }).lean();

    // Batch fetch all products in one query (no N+1)
    const productIds = [...new Set(allOrderItems.map((item: any) => item.product_id))];
    const allProducts = await Product.find({ _id: { $in: productIds } })
      .select("name nameHi galleryImages price discountPrice")
      .lean();
    const productsById = new Map(allProducts.map((p: any) => [p._id || p.id, p]));

    // Group items by order
    const itemsByOrderId = new Map<string, any[]>();
    for (const item of allOrderItems) {
      if (!itemsByOrderId.has(item.order_id)) {
        itemsByOrderId.set(item.order_id, []);
      }
      itemsByOrderId.get(item.order_id)!.push(item);
    }

    const result = [];
    for (const order of orders) {
      const orderItems = itemsByOrderId.get((order as any).order_id) || [];
      for (const orderItem of orderItems) {
        const product: any = productsById.get(orderItem.product_id);
        result.push({
          orderId: (order as any).order_id,
          amount: (order as any).amount,
          currency: (order as any).currency,
          status: (order as any).order_status,
          shiprocket: (order as any).shiprocket || null,
          createdAt: (order as any).createdAt,
          productId: product?._id || product?.id,
          productName: product?.name,
          productImage: product?.galleryImages,
          price: orderItem.price,
          quantity: orderItem.quantity,
        });
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("FETCH_ORDERS_ERROR", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
