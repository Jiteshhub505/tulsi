import connectDB from "@/db/mongoose";
import { Order, OrderItem, Cart, CartItem, Product } from "@/db/models";
import { getCartUserId } from "@/lib/cart/getCartUserId";
import crypto from "crypto";

export const POST = async (req: Request) => {
  await connectDB();
  const userId = await getCartUserId();

  try {
    const body = await req.json().catch(() => ({}));
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      shippingDetails,
      paymentMethod = "razorpay",
      couponCode = "",
      coinsToUse = 0,
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
      const basePrice = p.discountPrice ?? p.price;
      const effectiveUnitPrice = quantity >= 2 ? Math.round(basePrice * 0.9) : basePrice;
      return sum + effectiveUnitPrice * quantity;
    }, 0);

    const safeCoupon = typeof couponCode === "string" ? couponCode.trim().toUpperCase() : "";
    let discount = 0;
    const phone = shippingDetails?.phone || "";
    const cleanPhone = phone.replace(/\D/g, "").slice(-10);

    if (safeCoupon === "KRISH10") {
      discount = Math.round(subtotal * 0.1);
    } else if (safeCoupon) {
      const CouponModel = (await import("@/db/models")).Coupon;
      const foundCoupon = await CouponModel.findOne({ code: safeCoupon, isActive: true });
      if (foundCoupon) {
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
          await CouponModel.findByIdAndUpdate(foundCoupon._id, {
            $inc: { usedCount: 1 },
            ...(cleanPhone ? { $addToSet: { usedPhones: cleanPhone } } : {}),
          });
        }
      }
    }
    const subtotalAfterCoupon = subtotal - discount;

    // Apply Tulsi Coins
    let coinDiscount = 0;
    let validatedCoinsUsed = 0;

    if (coinsToUse > 0 && cleanPhone) {
      const CoinWallet = (await import("@/db/models")).CoinWallet;
      const wallet = await CoinWallet.findOne({ phone: cleanPhone });
      if (wallet && wallet.balance >= coinsToUse) {
        coinDiscount = Math.min(coinsToUse, Math.floor(subtotalAfterCoupon * 0.5));
        validatedCoinsUsed = coinDiscount;
      }
    }

    const amount = Math.max(1, subtotalAfterCoupon - coinDiscount);

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
      coinsUsed: validatedCoinsUsed,
      coinDiscount: coinDiscount,
    });

    // Deduct coins & award 5% cashback coins
    if (cleanPhone) {
      const CoinWallet = (await import("@/db/models")).CoinWallet;
      const wallet = await CoinWallet.findOne({ phone: cleanPhone });
      if (wallet) {
        if (validatedCoinsUsed > 0) {
          wallet.balance = Math.max(0, wallet.balance - validatedCoinsUsed);
          wallet.totalSpent = (wallet.totalSpent || 0) + validatedCoinsUsed;
          wallet.history.push({
            type: "order_redeem",
            amount: -validatedCoinsUsed,
            orderId,
            description: `🪙 Redeemed on Order #${orderId}`,
            date: new Date(),
          });
        }
        // 5% Cashback Coins on amount
        const earnedCoins = Math.round(amount * 0.05);
        if (earnedCoins > 0) {
          wallet.balance += earnedCoins;
          wallet.totalEarned = (wallet.totalEarned || 0) + earnedCoins;
          wallet.history.push({
            type: "order_earn",
            amount: earnedCoins,
            orderId,
            description: `🌿 5% Cashback Coins on Order #${orderId}`,
            date: new Date(),
          });
        }
        await wallet.save();
      }
    }

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

    // Automatically push to Shiprocket in background
    try {
      const { syncOrderToShiprocket } = await import("@/lib/shiprocket");
      const mappedOrderItems = cartItems.map((item) => ({
        order_id: orderId,
        product_id: item.productId,
        price: priceById.get(item.productId) ?? 0,
        quantity: item.quantity,
      }));
      syncOrderToShiprocket(order, mappedOrderItems, products)
        .then(async (shiprocketRes) => {
          if (shiprocketRes && (shiprocketRes.order_id || shiprocketRes.shipment_id)) {
            order.shiprocket = {
              orderId: shiprocketRes.order_id,
              shipmentId: shiprocketRes.shipment_id,
              status: shiprocketRes.status || "NEW",
              statusCode: shiprocketRes.status_code || 1,
              awbCode: shiprocketRes.awb_code || null,
              courierName: shiprocketRes.courier_name || null,
              lastTrackingUpdate: new Date(),
            };
            await order.save();
          }
        })
        .catch((err) => console.error("Shiprocket Auto-Sync Error (Prepaid):", err?.message || err));
    } catch (shipErr) {
      console.error("Failed to initiate Shiprocket sync:", shipErr);
    }

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
