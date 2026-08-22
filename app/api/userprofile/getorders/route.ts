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

    const orders = await Order.find({ $or: orConditions }).sort({ createdAt: -1 });

    const result = [];
    for (const order of orders) {
      const orderItems = await OrderItem.find({ order_id: order.order_id });
      for (const orderItem of orderItems) {
        const product = await Product.findById(orderItem.product_id);
        result.push({
          orderId: order.order_id,
          amount: order.amount,
          currency: order.currency,
          status: order.order_status,
          shiprocket: order.shiprocket || null,
          createdAt: order.createdAt,
          productId: product?.id,
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
