import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/db/mongoose";
import { Cart, CartItem, Order, OrderItem, Product, User } from "@/db/models";
import { getProductsById } from "@/lib/products/getProductsById";
import { GUEST_USER_ID, GUEST_USER_EMAIL } from "@/lib/constants";
import { getServerSession } from "next-auth";

/**
 * Places an order for the user's whole active cart.
 *
 * NOTE: Razorpay (and any real payment gateway) has been removed for now.
 * This marks the order as "paid" directly with no actual payment being
 * taken. Wire up a real payment provider before shipping this to
 * production.
 */
export const POST = async (req: Request) => {
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

  try {
    const body = await req.json().catch(() => ({}));
    const { shippingDetails = {}, paymentMethod = "razorpay", couponCode = "" } = body;

    const cart = await Cart.findOne({ userId, status: "active" });

    if (!cart) {
      return Response.json({
        status: 404,
        message: "Does not found Cart ID",
        success: false,
      });
    }

    const cartItems = await CartItem.find({ cartId: cart.id });
    if (cartItems.length === 0) {
      return Response.json({
        status: 404,
        message: "Cart is empty",
        success: false,
      });
    }

    const products = await Product.find({
      _id: { $in: cartItems.map((item) => item.productId) },
    });
    const priceById = new Map(
      products.map((p) => [p.id, p.discountPrice ?? p.price]),
    );

    // Calculate subtotal
    const subtotal = products.reduce((sum, p) => {
      const item = cartItems.find((ci) => ci.productId === p.id);
      const quantity = item ? item.quantity : 0;
      const unitPrice = p.discountPrice ?? p.price;
      return sum + unitPrice * quantity;
    }, 0);

    // Apply Coupon (10% off for KRISH10)
    const safeCoupon = typeof couponCode === "string" ? couponCode.trim().toUpperCase() : "";
    const discount = safeCoupon === "KRISH10" ? subtotal * 0.1 : 0;
    const subtotalAfterCoupon = subtotal - discount;
    const tax = (subtotalAfterCoupon * 5) / 100;
    const amount = subtotalAfterCoupon + tax;

    const orderId = `local_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const order = await Order.create({
      order_id: orderId,
      user_id: userId,
      amount,
      currency: "INR",
      order_status: paymentMethod === "cod" ? "created" : "paid",
      shippingDetails,
      paymentMethod,
      couponCode: safeCoupon,
    });

    await OrderItem.insertMany(
      cartItems.map((item) => ({
        order_id: orderId,
        product_id: item.productId,
        price: priceById.get(item.productId) ?? 0,
        quantity: item.quantity,
      })),
    );

    cart.status = "completed";
    await cart.save();

    return Response.json({
      order,
      success: true,
      message: "Order placed successfully",
    });
  } catch (error) {
    console.error("PLACE_CART_ORDER_ERROR", error);
    return Response.json({ success: false, message: "Failed to place order" });
  }
};
