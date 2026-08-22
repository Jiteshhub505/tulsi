import { NextResponse } from "next/server";
import connectDB from "@/db/mongoose";
import { Order } from "@/db/models";
import { assignCourierAWB } from "@/lib/shiprocket";

export async function POST(req: Request) {
  await connectDB();

  try {
    const { orderId, shipmentId, courierId } = await req.json();

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
          message: "Shipment ID not found. Please sync the order to Shiprocket first.",
        },
        { status: 400 }
      );
    }

    const res = await assignCourierAWB(targetShipmentId, courierId);

    const awbData = res?.response?.data || res?.data || res;
    const awbCode = awbData?.awb_code || res?.awb_code;
    const courierName = awbData?.courier_name || res?.courier_name;
    const courierCompanyId = awbData?.courier_company_id || res?.courier_company_id;

    if (order && awbCode) {
      order.shiprocket = {
        ...order.shiprocket,
        awbCode,
        courierName: courierName || order.shiprocket?.courierName,
        courierCompanyId: courierCompanyId || order.shiprocket?.courierCompanyId,
        status: "AWB ASSIGNED",
        lastTrackingUpdate: new Date(),
      };
      await order.save();
    }

    return NextResponse.json({
      success: true,
      message: "AWB generated successfully",
      awbCode,
      courierName,
      data: res,
      order,
    });
  } catch (error: any) {
    console.error("SHIPROCKET_GENERATE_AWB_ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        message: error?.response?.data?.message || error.message || "Failed to generate AWB",
        error: error?.response?.data || error.message,
      },
      { status: 500 }
    );
  }
}
