import connectDB from "@/db/mongoose";
import { Cart, CartItem, Product } from "@/db/models";
import { GUEST_USER_ID, GUEST_USER_EMAIL } from "@/lib/constants";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Razorpay from "razorpay";

export const POST = async (req: Request) => {
  await connectDB();

  const session = await getServerSession(authOptions);
  //@ts-ignore
  const userId = session?.user?.id || GUEST_USER_ID;

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
      const unitPrice = p.discountPrice ?? p.price;
      return sum + unitPrice * quantity;
    }, 0);

    const safeCoupon = typeof couponCode === "string" ? couponCode.trim().toUpperCase() : "";
    const discount = safeCoupon === "KRISH10" ? subtotal * 0.1 : 0;
    const subtotalAfterCoupon = subtotal - discount;
    const tax = (subtotalAfterCoupon * 5) / 100;
    const amount = subtotalAfterCoupon + tax;

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || "",
      key_secret: process.env.RAZORPAY_KEY_SECRET || "",
    });

    const rzpOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100), // convert to paisa
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    });

    return Response.json({
      success: true,
      keyId: process.env.RAZORPAY_KEY_ID,
      id: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
    });
  } catch (error) {
    console.error("INITIATE_PAYMENT_ERROR", error);
    return Response.json({ success: false, message: "Failed to initiate payment" }, { status: 500 });
  }
};
