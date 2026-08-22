import connectDB from "@/db/mongoose";
import { Cart, CartItem, Order, OrderItem, Product } from "@/db/models";
import { getCartUserId } from "@/lib/cart/getCartUserId";

export const POST = async (req: Request) => {
  await connectDB();
  const userId = await getCartUserId();

  try {
    const body = await req.json().catch(() => ({}));
    const {
      shippingDetails = {},
      paymentMethod = "razorpay",
      couponCode = "",
      coinsToUse = 0,
    } = body;

    const cart = await Cart.findOne({ userId, status: "active" });

    if (!cart) {
      return Response.json({
        status: 404,
        message: "Active cart not found",
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

    // Calculate subtotal (with 10% multi-buy discount for quantity >= 2)
    const subtotal = products.reduce((sum, p) => {
      const item = cartItems.find((ci) => ci.productId === p.id);
      const quantity = item ? item.quantity : 0;
      const basePrice = p.discountPrice ?? p.price;
      const effectiveUnitPrice = quantity >= 2 ? Math.round(basePrice * 0.9) : basePrice;
      return sum + effectiveUnitPrice * quantity;
    }, 0);

    // Apply Coupon
    const safeCoupon = typeof couponCode === "string" ? couponCode.trim().toUpperCase() : "";
    let discount = 0;
    const phone = shippingDetails?.phone || "";
    const cleanPhone = phone.replace(/\D/g, "").slice(-10);

    if (safeCoupon && cleanPhone) {
      const existingOrderWithCoupon = await Order.findOne({
        couponCode: safeCoupon,
        "shippingDetails.phone": new RegExp(cleanPhone + "$"),
        order_status: { $in: ["created", "paid"] },
      });
      if (existingOrderWithCoupon) {
        return Response.json({
          status: 400,
          message: `Coupon '${safeCoupon}' has already been redeemed on mobile number +91 ${cleanPhone}. Each coupon can only be used once per phone number.`,
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
            message: `Coupon '${safeCoupon}' has already been redeemed on mobile number +91 ${cleanPhone}. Each coupon can only be used once per phone number.`,
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

    const shippingFee = paymentMethod === "cod" ? 50 : 0;
    const amount = Math.max(1, subtotalAfterCoupon - coinDiscount + shippingFee);

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
        .catch((err) => console.error("Shiprocket Auto-Sync Error (Cart/COD):", err?.message || err));
    } catch (shipErr) {
      console.error("Failed to initiate Shiprocket sync:", shipErr);
    }

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
