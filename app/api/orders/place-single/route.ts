import connectDB from "@/db/mongoose";
import { Order, OrderItem, Product } from "@/db/models";
import { getCartUserId } from "@/lib/cart/getCartUserId";

export async function POST(req: Request) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");
  const userId = await getCartUserId();

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
