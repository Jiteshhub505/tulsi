import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/db/mongoose";
import { Order, OrderItem, Product, User } from "@/db/models";
import { GUEST_USER_ID, GUEST_USER_EMAIL } from "@/lib/constants";
import { getServerSession } from "next-auth";

/**
 * Places an order for a single product (the "Buy Now" flow on a product
 * page), bypassing the cart entirely.
 *
 * NOTE: Razorpay (and any real payment gateway) has been removed for now.
 * This marks the order as "paid" directly with no actual payment being
 * taken. Wire up a real payment provider before shipping this to
 * production.
 */
export async function POST(req: Request) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");

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

  if (!productId) {
    return Response.json({ status: 500, message: "No product ID" });
  }

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return Response.json({ status: 404, message: "Product does not found" });
    }

    const unitPrice = product.discountPrice ?? product.price;
    const amount = unitPrice;

    const orderId = `local_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const order = await Order.create({
      order_id: orderId,
      user_id: userId,
      amount,
      currency: "INR",
      order_status: "paid",
    });

    await OrderItem.create({
      order_id: orderId,
      product_id: productId,
      price: amount,
      quantity: 1,
    });

    return Response.json({
      order,
      success: true,
      message: "Order placed successfully",
    });
  } catch (error) {
    console.error("PLACE_SINGLE_ORDER_ERROR", error);
    return Response.json({
      error,
      success: false,
      message: "error creating orders",
    });
  }
}
