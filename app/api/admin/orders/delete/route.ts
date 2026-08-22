import { NextResponse } from "next/server";
import connectDB from "@/db/mongoose";
import { Order, OrderItem } from "@/db/models";

export async function DELETE(req: Request) {
  await connectDB();
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: "orderId is required" },
        { status: 400 }
      );
    }

    const deletedOrder = await Order.findOneAndDelete({
      $or: [{ order_id: orderId }, { _id: orderId }],
    });

    if (!deletedOrder) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    await OrderItem.deleteMany({
      $or: [{ order_id: orderId }, { order_id: deletedOrder.order_id }],
    });

    return NextResponse.json({
      success: true,
      message: `Order #${orderId} deleted successfully`,
    });
  } catch (error: any) {
    console.error("DELETE_ORDER_ERROR", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to delete order" },
      { status: 500 }
    );
  }
}
