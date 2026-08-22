import { NextResponse } from "next/server";
import connectDB from "@/db/mongoose";
import { Order } from "@/db/models";
import { cancelShiprocketOrder } from "@/lib/shiprocket";

export async function POST(req: Request) {
  await connectDB();

  try {
    const { orderId, shiprocketOrderId } = await req.json();

    if (!orderId && !shiprocketOrderId) {
      return NextResponse.json(
        { success: false, message: "orderId or shiprocketOrderId is required" },
        { status: 400 }
      );
    }

    let order = null;
    let targetOrderId = shiprocketOrderId;

    if (orderId) {
      order = await Order.findOne({ order_id: orderId });
      if (!order) {
        return NextResponse.json(
          { success: false, message: "Order not found" },
          { status: 404 }
        );
      }
      targetOrderId = order.shiprocket?.orderId || shiprocketOrderId;
    }

    if (!targetOrderId) {
      return NextResponse.json(
        {
          success: false,
          message: "Shiprocket Order ID not found.",
        },
        { status: 400 }
      );
    }

    const res = await cancelShiprocketOrder([targetOrderId]);

    if (order) {
      order.shiprocket = {
        ...order.shiprocket,
        status: "CANCELLED",
        lastTrackingUpdate: new Date(),
      };
      await order.save();
    }

    return NextResponse.json({
      success: true,
      message: "Shiprocket shipment cancelled successfully",
      data: res,
      order,
    });
  } catch (error: any) {
    console.error("SHIPROCKET_CANCEL_ORDER_ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        message: error?.response?.data?.message || error.message || "Failed to cancel shipment",
        error: error?.response?.data || error.message,
      },
      { status: 500 }
    );
  }
}
