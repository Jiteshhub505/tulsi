import connectDB from "@/db/mongoose";
import { Order, OrderItem, Cart, CartItem, Product, User } from "@/db/models";
import { GUEST_USER_ID, GUEST_USER_EMAIL } from "@/lib/constants";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import crypto from "crypto";

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
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      shippingDetails,
      paymentMethod = "razorpay",
      couponCode = "",
    } = body;

    // Verify signature
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return Response.json({ success: false, message: "Payment verification failed: invalid signature" }, { status: 400 });
    }

    const cart = await Cart.findOne({ userId, status: "active" });
    if (!cart) {
      return Response.json({ success: false, message: "Cart not found" }, { status: 404 });
    }

    const cartItems = await CartItem.find({ cartId: cart.id });
    if (cartItems.length === 0) {
      return Response.json({ success: false, message: "Cart is empty" }, { status: 400 });
    }

    const products = await Product.find({
      _id: { $in: cartItems.map((item) => item.productId) },
    });
    const priceById = new Map(
      products.map((p) => [p.id, p.discountPrice ?? p.price]),
    );

    const subtotal = products.reduce((sum, p) => {
      const item = cartItems.find((ci) => ci.productId === p.id);
      const quantity = item ? item.quantity : 0;
      const unitPrice = p.discountPrice ?? p.price;
      return sum + unitPrice * quantity;
    }, 0);

    const safeCoupon = typeof couponCode === "string" ? couponCode.trim().toUpperCase() : "";
    const discount = safeCoupon === "KRISH10" ? subtotal * 0.1 : 0;
    const subtotalAfterCoupon = subtotal - discount;
    const amount = subtotalAfterCoupon;

    const orderId = `rzp_${razorpay_order_id.replace("order_", "")}`;

    const order = await Order.create({
      order_id: orderId,
      user_id: userId,
      amount,
      currency: "INR",
      order_status: "paid",
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
    console.error("VERIFY_PAYMENT_ERROR", error);
    return Response.json({ success: false, message: "Failed to place order" }, { status: 500 });
  }
};
