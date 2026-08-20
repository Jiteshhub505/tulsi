import connectDB from "@/db/mongoose";
import { Cart, CartItem, Order, OrderItem, Product } from "@/db/models";
import { getCartUserId } from "@/lib/cart/getCartUserId";

export const POST = async (req: Request) => {
  await connectDB();
  const userId = await getCartUserId();

  try {
    const body = await req.json().catch(() => ({}));
    const { shippingDetails = {}, paymentMethod = "razorpay", couponCode = "" } = body;

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

    // Apply Coupon (10% off for KRISH10)
    const safeCoupon = typeof couponCode === "string" ? couponCode.trim().toUpperCase() : "";
    const discount = safeCoupon === "KRISH10" ? subtotal * 0.1 : 0;
    const subtotalAfterCoupon = subtotal - discount;
    const shippingFee = paymentMethod === "cod" ? 50 : 0;
    const amount = subtotalAfterCoupon + shippingFee;

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
