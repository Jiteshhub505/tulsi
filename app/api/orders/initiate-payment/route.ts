import connectDB from "@/db/mongoose";
import { Cart, CartItem, Product } from "@/db/models";
import { getCartUserId } from "@/lib/cart/getCartUserId";
import Razorpay from "razorpay";

export const POST = async (req: Request) => {
  await connectDB();
  const userId = await getCartUserId();

  try {
    const body = await req.json().catch(() => ({}));
    const { couponCode = "", coinsToUse = 0, phone = "" } = body;

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
    let discount = 0;
    const cleanPhone = phone ? phone.toString().replace(/\D/g, "").slice(-10) : "";

    if (safeCoupon && cleanPhone) {
      const OrderModel = (await import("@/db/models")).Order;
      const existingOrderWithCoupon = await OrderModel.findOne({
        couponCode: safeCoupon,
        "shippingDetails.phone": new RegExp(cleanPhone + "$"),
        order_status: { $in: ["created", "paid"] },
      });
      if (existingOrderWithCoupon) {
        return Response.json({
          status: 400,
          message: `Coupon '${safeCoupon}' has already been used on mobile number +91 ${cleanPhone}. Each coupon is valid only once per phone number.`,
          success: false,
        });
      }
    }

    if (safeCoupon === "KRISH10") {
      discount = Math.round(subtotal * 0.1);
    } else if (safeCoupon) {
      const CouponModel = (await import("@/db/models")).Coupon;
      const foundCoupon = await CouponModel.findOne({ code: safeCoupon, isActive: true });
      if (foundCoupon) {
        if (cleanPhone && foundCoupon.usedPhones && foundCoupon.usedPhones.includes(cleanPhone)) {
          return Response.json({
            status: 400,
            message: `Coupon '${safeCoupon}' has already been used on mobile number +91 ${cleanPhone}. Each coupon is valid only once per phone number.`,
            success: false,
          });
        }
        const notExpired = !foundCoupon.expiryDate || new Date(foundCoupon.expiryDate) >= new Date();
        const minOrderMet = !foundCoupon.minOrderAmount || subtotal >= foundCoupon.minOrderAmount;
        const limitNotReached = !foundCoupon.usageLimit || foundCoupon.usedCount < foundCoupon.usageLimit;
        if (notExpired && minOrderMet && limitNotReached) {
          if (foundCoupon.discountType === "percentage") {
            let calc = (subtotal * foundCoupon.discountValue) / 100;
            if (foundCoupon.maxDiscount && calc > foundCoupon.maxDiscount) {
              calc = foundCoupon.maxDiscount;
            }
            discount = Math.round(calc);
          } else {
            discount = Math.min(subtotal, foundCoupon.discountValue);
          }
        }
      }
    }
    const subtotalAfterCoupon = subtotal - discount;

    let coinDiscount = 0;
    if (coinsToUse > 0 && phone) {
      const cleanPhone = phone.replace(/\D/g, "").slice(-10);
      const wallet = await (await import("@/db/models")).CoinWallet.findOne({ phone: cleanPhone });
      if (wallet && wallet.balance >= coinsToUse) {
        coinDiscount = Math.min(coinsToUse, Math.floor(subtotalAfterCoupon * 0.5));
      }
    }

    const amount = Math.max(1, subtotalAfterCoupon - coinDiscount);

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
