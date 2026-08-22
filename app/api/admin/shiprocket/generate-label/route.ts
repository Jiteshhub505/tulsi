import { NextResponse } from "next/server";
import connectDB from "@/db/mongoose";
import { Order } from "@/db/models";
import { generateShippingLabel } from "@/lib/shiprocket";

export async function POST(req: Request) {
  await connectDB();

  try {
    const { orderId, shipmentId } = await req.json();

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
          message: "Shipment ID not found. Ensure order is synced and AWB is assigned.",
        },
        { status: 400 }
      );
    }

    const res = await generateShippingLabel([targetShipmentId]);
    const labelUrl = res?.label_url || res?.response?.label_url || res?.data?.label_url;

    if (order && labelUrl) {
      order.shiprocket = {
        ...order.shiprocket,
        labelUrl,
      };
      await order.save();
    }

    return NextResponse.json({
      success: true,
      labelUrl,
      data: res,
    });
  } catch (error: any) {
    console.error("SHIPROCKET_GENERATE_LABEL_ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        message: error?.response?.data?.message || error.message || "Failed to generate label",
        error: error?.response?.data || error.message,
      },
      { status: 500 }
    );
  }
}
