import connectDB from "@/db/mongoose";
import { Order, User, OrderItem, Product } from "@/db/models";

export const GET = async (req: Request) => {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const orderId = searchParams.get("orderId");

  const validUserId = userId && userId !== "null" && userId !== "undefined" ? userId.trim() : null;
  const validOrderId = orderId && orderId !== "null" && orderId !== "undefined" ? orderId.trim() : null;

  if (!validUserId && !validOrderId) {
    return Response.json({
      success: false,
      message: "USER_ID or ORDER_ID required",
    });
  }

  try {
    let order: any = null;
    if (validOrderId) {
      order = await Order.findOne({
        $or: [{ order_id: validOrderId }, { _id: validOrderId }],
      }).lean();
    }
    if (!order && validUserId) {
      order = await Order.findOne({
        $or: [{ user_id: validUserId }, { _id: validUserId }],
      }).sort({ createdAt: -1 }).lean();
    }

    if (!order) {
      return Response.json({
        success: false,
        message: "Order not found",
      });
    }

    // Safely query user details without casting errors
    const isValidObjectId = (id: any) => typeof id === "string" && /^[0-9a-fA-F]{24}$/.test(id);
    const userOrConditions: any[] = [];
    if (isValidObjectId(order.user_id)) {
      userOrConditions.push({ _id: order.user_id });
    }
    if (order.shippingDetails?.email) {
      userOrConditions.push({ email: order.shippingDetails.email });
    }
    if (order.shippingDetails?.phone) {
      const cleanPhone = order.shippingDetails.phone.replace(/\D/g, "").slice(-10);
      userOrConditions.push({ phone: new RegExp(cleanPhone + "$") });
    }

    let userDetails: any[] = [];
    if (userOrConditions.length > 0) {
      try {
        userDetails = await User.find({ $or: userOrConditions }).lean();
      } catch (err) {
        console.error("USER_QUERY_WARN", err);
      }
    }

    if (!userDetails || userDetails.length === 0) {
      userDetails = [
        {
          _id: order.user_id || "guest_user",
          name: order.shippingDetails?.fullName || "Customer",
          email: order.shippingDetails?.email || "customer@tulsiveda.com",
          phone: order.shippingDetails?.phone || "",
          role: "Customer",
          image: "",
          createdAt: order.createdAt || new Date(),
          emailVerified: null,
        },
      ];
    }

    // Find all transactions for this customer safely
    const orConditions: any[] = [];
    if (order.user_id && order.user_id !== "guest_user_id") {
      orConditions.push({ user_id: order.user_id });
    }
    if (order.shippingDetails?.phone) {
      const cleanPhone = order.shippingDetails.phone.replace(/\D/g, "").slice(-10);
      orConditions.push({ "shippingDetails.phone": new RegExp(cleanPhone + "$") });
    }
    if (order.shippingDetails?.email) {
      orConditions.push({ "shippingDetails.email": order.shippingDetails.email });
    }
    if (orConditions.length === 0) {
      orConditions.push({ order_id: order.order_id });
    }

    let allTransactions: any[] = [];
    try {
      allTransactions = await Order.find({ $or: orConditions }).sort({ createdAt: -1 }).lean();
    } catch (err) {
      allTransactions = [order];
    }

    // Fetch order items safely
    let orderItems: any[] = [];
    try {
      orderItems = await OrderItem.find({
        $or: [{ order_id: order.order_id }, { order_id: validOrderId || "" }],
      }).lean();
    } catch (err) {
      console.error("ORDER_ITEMS_QUERY_WARN", err);
    }

    const productIds = orderItems.map((item) => item.product_id || item.productId).filter(Boolean);
    let products: any[] = [];
    if (productIds.length > 0) {
      try {
        products = await Product.find({
          $or: [{ _id: { $in: productIds } }, { id: { $in: productIds } }],
        }).lean();
      } catch (err) {
        console.error("PRODUCTS_QUERY_WARN", err);
      }
    }

    const itemsWithDetails = orderItems.map((item) => {
      const pid = item.product_id || item.productId;
      const product = products.find((p) => p._id === pid || p.id === pid);
      return {
        product_id: pid,
        quantity: item.quantity,
        price: item.price,
        name: product ? product.name : (item.name || "Ayurvedic Product"),
        image: product && product.galleryImages && product.galleryImages.length > 0 ? product.galleryImages[0] : "",
      };
    });

    return Response.json({
      success: true,
      details: {
        userDetails,
        allTransactions: allTransactions.length > 0 ? allTransactions : [order],
        specificTransaction: [order],
        orderItems: itemsWithDetails,
      },
      message: "successfully fetched details",
    });
  } catch (error: any) {
    console.error("ADMIN_TRANSACTION_USERSPECIFIC_ERROR", error);
    return Response.json({
      success: false,
      message: error?.message || "error getting details",
      error,
    });
  }
};
