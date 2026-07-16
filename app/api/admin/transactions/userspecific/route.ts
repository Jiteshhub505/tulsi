import connectDB from "@/db/mongoose";
import { Order, User, OrderItem, Product } from "@/db/models";

export const GET = async (req: Request) => {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const orderId = searchParams.get("orderId");

  if (!userId || !orderId)
    return Response.json({
      success: false,
      message: "USER_ID or ORDER_ID not found ",
    });

  try {
    const userDetails = await User.find({ _id: userId }).lean();

    const specificTransaction = await Order.find({
      user_id: userId,
      order_id: orderId,
    }).lean();

    const allTransactions = await Order.find({ user_id: userId }).lean();

    // Fetch order items
    const orderItems = await OrderItem.find({ order_id: orderId });
    const products = await Product.find({
      _id: { $in: orderItems.map((item) => item.product_id) },
    });

    const itemsWithDetails = orderItems.map((item) => {
      const product = products.find((p) => p.id === item.product_id);
      return {
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
        name: product ? product.name : "Unknown Product",
        image: product && product.galleryImages && product.galleryImages.length > 0 ? product.galleryImages[0] : "",
      };
    });

    return Response.json({
      success: true,
      details: {
        userDetails,
        allTransactions,
        specificTransaction,
        orderItems: itemsWithDetails,
      },
      message: "successfuly fetched details",
    });
  } catch (error) {
    return Response.json({
      success: false,
      message: "error getting details",
      error,
    });
  }
};
