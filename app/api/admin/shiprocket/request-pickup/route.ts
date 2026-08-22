import { NextResponse } from "next/server";
import connectDB from "@/db/mongoose";
import { Order } from "@/db/models";
import { requestPickup } from "@/lib/shiprocket";

export async function POST(req: Request) {
  await connectDB();

  try {
    const { orderId, shipmentId, pickupDate } = await req.json();

    if (!orderId && !shipmentId) {
      return NextResponse.json(
        { success: false, message: "orderId or shipmentId is required" },
        { status: 400 }
      );
    }

    let order = null;
    let targetShipmentId = shipmentId;

    if (orderId) {
      order = await Order.findOne({ order_id: orderId });
      if (!order) {
        return NextResponse.json(
          { success: false, message: "Order not found" },
          { status: 404 }
        );
      }
      targetShipmentId = order.shiprocket?.shipmentId || shipmentId;
    }

    if (!targetShipmentId) {
      return NextResponse.json(
        {
          success: false,
          message: "Shipment ID not found. Generate AWB and sync order first.",
        },
        { status: 400 }
      );
    }

    const res = await requestPickup(targetShipmentId, pickupDate);

    const pickupToken = res?.response?.pickup_token_number || res?.pickup_token_number;
    const scheduledDate = pickupDate || new Date().toISOString().split("T")[0];

    if (order) {
      order.shiprocket = {
        ...order.shiprocket,
        pickupTokenNumber: pickupToken || order.shiprocket?.pickupTokenNumber,
        pickupScheduledDate: scheduledDate,
        status: "PICKUP SCHEDULED",
        lastTrackingUpdate: new Date(),
      };
      await order.save();
    }

    return NextResponse.json({
      success: true,
      message: "Pickup scheduled successfully",
      pickupTokenNumber: pickupToken,
      data: res,
      order,
    });
  } catch (error: any) {
    console.error("SHIPROCKET_REQUEST_PICKUP_ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        message: error?.response?.data?.message || error.message || "Failed to schedule pickup",
        error: error?.response?.data || error.message,
      },
      { status: 500 }
    );
  }
}
