import connectDB from "@/db/mongoose";
import { Cart, CartItem, Product } from "@/db/models";
import { getCartUserId } from "@/lib/cart/getCartUserId";
import Razorpay from "razorpay";

export const POST = async (req: Request) => {
  await connectDB();
  const userId = await getCartUserId();

  try {
    const body = await req.json().catch(() => ({}));
    const { couponCode = "" } = body;

    const cart = await Cart.findOne({ userId, status: "active" });
    if (!cart) {
      return Response.json({ success: false, message: "Cart not found" }, { status: 404 });
    }

    const cartItems = await CartItem.find({ cartId: cart.id });
    if (cartItems.length === 0) {
      return Response.json({ success: false, message: "Cart is empty" }, { status: 404 });
    }

    const products = await Product.find({
      _id: { $in: cartItems.map((item) => item.productId) },
    });

    const subtotal = products.reduce((sum, p) => {
      const item = cartItems.find((ci) => ci.productId === p.id);
      const quantity = item ? item.quantity : 0;
      const basePrice = p.discountPrice ?? p.price;
      const effectiveUnitPrice = quantity >= 2 ? Math.round(basePrice * 0.9) : basePrice;
      return sum + effectiveUnitPrice * quantity;
    }, 0);

    const safeCoupon = typeof couponCode === "string" ? couponCode.trim().toUpperCase() : "";
    const discount = safeCoupon === "KRISH10" ? subtotal * 0.1 : 0;
    const subtotalAfterCoupon = subtotal - discount;
    const amount = subtotalAfterCoupon;

    const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return Response.json(
        {
          success: false,
          message: "Razorpay credentials (RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET) are missing in environment variables.",
        },
        { status: 400 }
      );
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const rzpOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100), // convert to paisa
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    });

    return Response.json({
      success: true,
      keyId,
      id: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
    });
  } catch (error: any) {
    console.error("INITIATE_PAYMENT_ERROR", error);
    const isAuthError =
      error?.statusCode === 401 ||
      error?.error?.code === "BAD_REQUEST_ERROR" ||
      error?.error?.description?.toLowerCase().includes("auth");

    const message = isAuthError
      ? "Razorpay authentication failed. Please check RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your .env configuration."
      : error?.error?.description || error?.message || "Failed to initiate payment";

    return Response.json({ success: false, message }, { status: isAuthError ? 400 : 500 });
  }
};
